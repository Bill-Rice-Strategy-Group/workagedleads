import { NextResponse } from "next/server";
import { fetchGSCReport, type GSCReport } from "@/lib/cron/gsc-data";
import {
  fetchGscTrend,
  appendGscSnapshot,
  serializeGscTrend,
  type GscPropertyKey,
} from "@/lib/cron/gsc-trend";
import { activeProperties, inWarmup } from "@/lib/cron/gsc-properties";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun } from "@/lib/cron/heartbeat";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Dedicated GSC-trend snapshot cron.
//
// Split out of `daily-performance` on 2026-07-03. The daily performance *report
// email* and the `performance-backlog.json` auto-commits are superseded by the
// consolidated BRSG Portfolio Performance Report (billricestrategy.com), so
// `daily-performance` was unscheduled. But its Step 2b — the `gsc-trend.json`
// snapshot — is the disavow / toxic-backlink tripwire and must keep recording
// daily. This route is that step, standalone: fetch GSC, append the snapshot,
// commit if changed. No AI, no email, no backlog. `health-check` monitors it
// (2-day staleness) so a silent stall — e.g. the 2026-06 Vercel WIF break that
// froze the trend for 4 days undetected — now alerts within a day.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const reportDate = new Date().toISOString().split("T")[0];
  const properties = activeProperties(reportDate);

  // ── Fetch each property ──────────────────────────────────────
  // One property's bad day must never suppress another's good one, so each is
  // fetched independently and failures are recorded per property.
  const results: {
    key: GscPropertyKey;
    label: string;
    warmup: boolean;
    gsc?: GSCReport;
    error?: string;
  }[] = [];

  for (const prop of properties) {
    const base = {
      key: prop.key,
      label: prop.label,
      warmup: inWarmup(prop, reportDate),
    };
    try {
      const gsc = await fetchGSCReport(prop.gscSiteUrl, {
        watchPages: prop.watchPages,
      });
      if (gsc.available) {
        results.push({ ...base, gsc });
      } else {
        results.push({ ...base, error: gsc.error });
      }
    } catch (err) {
      results.push({
        ...base,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Every property unreadable is a real failure — auth, network, or a revoked
  // grant. Nothing is written, and health-check's staleness alarm picks it up.
  const usable = results.filter((r) => r.gsc);
  if (usable.length === 0) {
    const msg = `GSC unavailable for all properties: ${results
      .map((r) => `${r.key}: ${r.error}`)
      .join("; ")}`;
    console.error(`[GscTrend] ${msg}`);
    await recordCronRun({
      name: "gsc-trend",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  // ── Append one snapshot per readable property, commit once ───
  let committed = false;
  let daysTracked = 0;
  const summary: string[] = [];
  try {
    let trend = await fetchGscTrend();
    let anyChanged = false;

    for (const r of usable) {
      const { trend: next, changed } = appendGscSnapshot(
        trend,
        r.gsc!,
        reportDate,
        r.key,
        r.warmup
      );
      trend = next;
      anyChanged = anyChanged || changed;

      const row = next.snapshots.find(
        (s) => s.date === reportDate && s.property === r.key
      );
      summary.push(
        row?.status === "no-data"
          ? `${r.key}: no-data`
          : `${r.key}: ${r.gsc!.sevenDay.metrics.clicks} clk / ${r.gsc!.sevenDay.metrics.impressions} impr`
      );
    }
    for (const r of results.filter((x) => !x.gsc)) {
      summary.push(`${r.key}: unreadable (${r.error})`);
    }

    // usable is non-empty (checked above), so the loop ran at least once.
    if (!trend) throw new Error("no trend produced despite a readable property");

    daysTracked = new Set(trend.snapshots.map((s) => s.date)).size;

    if (anyChanged) {
      await commitFilesToGitHub(
        [
          {
            path: "data/gsc-trend.json",
            content: serializeGscTrend(trend, new Date().toISOString()),
          },
        ],
        `chore(gsc): trend snapshot — ${reportDate}\n\n${summary.join("; ")}`
      );
      committed = true;
      console.log(`[GscTrend] Snapshot committed (${daysTracked} days tracked)`);
    } else {
      console.log("[GscTrend] Trend unchanged — skipping commit");
    }
  } catch (err) {
    const msg = `GSC trend update failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[GscTrend] ${msg}`);
    await recordCronRun({
      name: "gsc-trend",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  const duration = Date.now() - startTime;
  await recordCronRun({
    name: "gsc-trend",
    status: usable.length === results.length ? "ok" : "partial",
    detail: `${summary.join("; ")}; ${daysTracked} days tracked; committed=${committed}`,
    durationMs: duration,
  });

  return NextResponse.json({
    success: true,
    reportDate,
    committed,
    daysTracked,
    properties: summary,
    duration,
  });
}
