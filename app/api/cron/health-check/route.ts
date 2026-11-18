import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { recordCronRun, type CronName } from "@/lib/cron/heartbeat";
import { MONITORED_CRONS, CRON_STALENESS } from "@/lib/cron/monitored";
import { evaluatePriceIndexAge, latestPublishedMonth, studyAgeDays } from "@/lib/cron/price-index-check";
import {
  alertSubject,
  failingChecks,
  reminderChecks,
  shouldSendAlert,
  type HealthCheck,
} from "@/lib/cron/health-alert";
import { PRICE_BENCHMARKS, quarterLabel } from "@/data/price-benchmarks";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALERT_EMAIL = "bill@billricestrategy.com";

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!projectId || !token) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

function daysBetween(fromIso: string, to: Date): number {
  const from = new Date(fromIso).getTime();
  return Math.round((to.getTime() - from) / 86400000);
}

// Benchmark freshness is a *content* signal about the Lead Price Index study,
// not a health signal about the marketwatch cron. Those came apart when the
// cron deliberately stopped synthesizing benchmarks (single-provider LLM
// guesses were polluting the public index — see app/api/cron/marketwatch, and
// note upsertPriceBenchmarks now has no callers). Nothing writes priceBenchmark
// on a schedule any more; the study is published by hand.
//
// The old check asserted a 35-day bound and blamed the cron by name when it
// tripped. Since the last study landed 2026-06-01 that fired every single day,
// and the accusation was false every time — the cron ran fine on 2026-08-01
// (scanned=15 changed=13 pricingSignals=7). It got recorded in BACKLOG.md as
// "marketwatch cron failing since ~2026-08-01", which it never was. A monitor
// that names the wrong culprit is worse than no monitor.
//
// So: measure the study on the study's own quarterly cadence, and let the
// marketwatch heartbeat below be the only thing that speaks for the cron.
// The age threshold lives in lib/cron/price-index-check.ts. Since 2026-11-18 an
// overdue study is a *reminder* (ok, reminder: true): it never sends the alert
// email on its own — see lib/cron/health-alert.ts.

/**
 * MEASURE THE PUBLISHED STUDY, NOT THE SANITY DOCS (fixed 2026-10-07).
 *
 * This used to read `*[_type == "priceBenchmark"] | order(_updatedAt desc)[0]`
 * — the documents the marketwatch cron wrote monthly until 2026-06-01. Those
 * are not the study. `data/price-benchmarks.ts` is, and its own header says so:
 * "published as a quarterly human-verified study (not a live AI-estimated
 * feed)". The page serves PRICE_BENCHMARKS; that is what a reader sees and what
 * the Cite-This button cites.
 *
 * The gap was not academic. On 2026-10-07 the alert reported 128 days, measured
 * off the June Sanity docs, while the PUBLISHED study was month 2026-03 — 220
 * days old. The check was understating the staleness of the thing readers
 * actually read by 92 days, and it was the mild number that went into the
 * daily email.
 *
 * Same failure shape as the provider "Verified" badge: a monitor pointed at the
 * machine-written artifact instead of the human-published one, and therefore
 * reporting the comfortable number.
 */
function checkPriceIndexStudy(now: Date): HealthCheck {
  const newest = latestPublishedMonth(PRICE_BENCHMARKS);

  if (!newest) {
    return {
      name: "Lead Price Index study",
      ok: false,
      detail: "PRICE_BENCHMARKS is empty — nothing is published",
    };
  }

  // Month granularity: treat the study as published at the start of its month,
  // which is the conservative reading. A study stamped 2026-03 is at least as
  // old as 2026-03-01.
  const publishedAt = `${newest}-01T00:00:00Z`;
  const age = studyAgeDays(newest, now);
  const { ok, reminder, detail } = evaluatePriceIndexAge(age);

  const count = PRICE_BENCHMARKS.filter((b) => b.month === newest).length;
  return {
    name: "Lead Price Index study",
    ok,
    reminder,
    detail: `${detail} Published study: ${quarterLabel(newest)} (${newest}), ${count} benchmarks.`,
    lastSeen: publishedAt,
    ageDays: age,
  };
}


async function checkCronHeartbeats(
  client: ReturnType<typeof getSanityClient>,
  now: Date
): Promise<HealthCheck[]> {
  const heartbeats = await client.fetch<
    { name: CronName; status: string; ranAt: string; detail: string }[]
  >(`*[_type == "cronHeartbeat"]{ name, status, ranAt, detail }`);
  const byName = new Map(heartbeats.map((h) => [h.name, h]));
  const results: HealthCheck[] = [];
  for (const name of MONITORED_CRONS) {
    const { maxDays, label, firstExpectedAt } = CRON_STALENESS[name];
    const hb = byName.get(name);
    if (!hb) {
      const waiting = firstExpectedAt ? now < new Date(firstExpectedAt) : false;
      results.push({
        name: label,
        ok: waiting,
        detail: waiting
          ? `Newly monitored — first run expected by ${firstExpectedAt}, not alerting until then`
          : `No heartbeat recorded yet — cron has never run or can't write to Sanity`,
      });
      continue;
    }
    const age = daysBetween(hb.ranAt, now);
    const stale = age > maxDays;
    const failed = hb.status === "failed";
    const ok = !stale && !failed;
    let detail: string;
    if (stale) {
      detail = `Last run ${age}d ago (threshold ${maxDays}d) — cron may have stopped firing. Last status: ${hb.status}`;
    } else if (failed) {
      detail = `Last run failed ${age}d ago: ${hb.detail?.slice(0, 200) || "(no detail)"}`;
    } else {
      detail = `Last run ${age}d ago [${hb.status}]: ${hb.detail?.slice(0, 120) || ""}`;
    }
    results.push({ name: label, ok, detail, lastSeen: hb.ranAt, ageDays: age });
  }
  return results;
}

function buildAlertEmail(checks: HealthCheck[], now: Date): string {
  const failing = failingChecks(checks);
  const reminders = reminderChecks(checks);
  const rows = checks
    .map((c) => {
      const isReminder = c.ok && c.reminder === true;
      const dot = !c.ok ? "#dc2626" : isReminder ? "#d97706" : "#10b981";
      const text = !c.ok ? "#991b1b" : isReminder ? "#92400e" : "#1f2937";
      const tag = isReminder ? ` <span style="font-weight: 400; color: #92400e;">(reminder)</span>` : "";
      return `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${dot}; margin-right: 8px;"></span>${c.name}${tag}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: ${text};">${c.detail}</td>
      </tr>`;
    })
    .join("");

  const bannerColor = failing.length > 0 ? "#dc2626" : "#166534";
  const bannerLabel =
    failing.length > 0
      ? `${failing.length} cron health check${failing.length > 1 ? "s" : ""} failing`
      : "All automations healthy";
  const reminderNote =
    reminders.length > 0
      ? ` Amber rows are human-task reminders, not failures — they never send this email on their own.`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #1f2937; max-width: 640px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, ${bannerColor}, #1B4D3E); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 4px; font-size: 22px;">Work Aged Leads Cron Health</h1>
    <p style="margin: 0; opacity: 0.95;">${bannerLabel}</p>
    <p style="margin: 8px 0 0; opacity: 0.7; font-size: 13px;">${now.toISOString()}</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
    ${rows}
  </table>
  <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This alert fires daily at 13:00 UTC. You only receive an email when something is failing.${reminderNote}</p>
</body></html>`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const now = new Date();
  const client = getSanityClient();

  const [contentChecks, heartbeatChecks] = await Promise.all([
    Promise.all([Promise.resolve(checkPriceIndexStudy(now))]),
    checkCronHeartbeats(client, now),
  ]);

  const checks = [...contentChecks, ...heartbeatChecks];
  const failing = failingChecks(checks);
  const reminders = reminderChecks(checks);

  // Reminders (e.g. an overdue Lead Price Index study) never send this email
  // on their own; they ride along only when a real failure sends it.
  if (shouldSendAlert(checks)) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Work Aged Leads <noreply@workagedleads.com>";
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: fromEmail,
          to: ALERT_EMAIL,
          subject: alertSubject(checks),
          html: buildAlertEmail(checks, now),
        });
      } catch (err) {
        console.error("[Health] Failed to send alert email:", err);
      }
    }
  }

  await recordCronRun({
    name: "health-check",
    status: failing.length === 0 ? "ok" : "partial",
    detail: failing.length === 0 ? "all checks passing" : `${failing.length} failing`,
    durationMs: Date.now() - startTime,
  });

  return NextResponse.json({
    ok: failing.length === 0,
    reminders: reminders.map((c) => c.name),
    checks,
    timestamp: now.toISOString(),
  });
}
