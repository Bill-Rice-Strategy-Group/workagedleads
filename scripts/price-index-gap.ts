/**
 * Lead Price Index — Q3 research brief generator.
 *
 * The Price Index is a quarterly *human-verified* study (see
 * `app/api/cron/marketwatch/route.ts:156` and the 2026-06-09 repositioning).
 * Nothing auto-publishes benchmarks and nothing in this script does either —
 * it produces the *research brief* that makes the human study tractable:
 * exactly which cells need re-pricing, which providers already showed a
 * pricing signal this cycle, and how far each vertical is from a trend chart.
 *
 * "Has chart" / "months needed" come from `selectTrendSeries` in
 * `lib/price-trend-series.ts` — the same function the page renders from. An
 * earlier version counted months across ANY trust-passing cell (real-time
 * included) and overstated how close verticals were; see BACKLOG.md.
 *
 * Why this exists: `data/loop/README.md` — a derived artifact assembled by
 * hand goes stale with no signal. Regenerate with `npm run price-index:gap`.
 *
 * Reads only. Writes one markdown file. No Sanity token required — the
 * production dataset is world-readable.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  PRICE_BENCHMARKS,
  isTrustworthyBenchmark,
} from "../data/price-benchmarks";
import {
  buildAgedTrendSeries,
  isAgedTrendBracket,
  selectTrendSeries,
  trendSeriesKey,
  TREND_CHART_MIN_MONTHS,
  type TrendSeries,
} from "../lib/price-trend-series";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "p7rbtajg";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** `lib/benchmark-coverage.ts` trust gate — single-provider rows are junk. */
const MIN_PROVIDERS = 2;

const REPORTS_DIR = join(process.cwd(), "data", "marketwatch-reports");
const OUT_PATH = join(process.cwd(), "data", "loop", "price-index-q3-gap.md");

interface Benchmark {
  vertical: string;
  month: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled: number | null;
  confidence: string | null;
}

interface RawPricing {
  vertical?: string;
  leadType?: string;
  ageBracket?: string;
  priceRange?: string;
}

interface ProviderUpdate {
  providerSlug: string;
  providerName: string;
  pricingChanges?: string[];
  rawPricingData?: (RawPricing | string)[];
}

async function fetchBenchmarks(): Promise<Benchmark[]> {
  // Same ordering as the page's query, so "first benchmark per month wins"
  // in buildAgedTrendSeries resolves duplicates identically.
  const query = `*[_type=="priceBenchmark"] | order(month desc) {
    month, leadAgeBracket, exclusivity, leadType,
    priceLow, priceMedian, priceHigh, providersSampled, confidence,
    "vertical": vertical->slug.current
  }`;
  const url =
    `https://${PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { result?: Benchmark[] };
  if (!body.result) throw new Error("Sanity returned no result set");
  return body.result.filter((b) => b.vertical);
}

function loadProviderSignals(): Map<string, ProviderUpdate[]> {
  const byMonth = new Map<string, ProviderUpdate[]>();
  for (const file of readdirSync(REPORTS_DIR).sort()) {
    if (!file.endsWith(".json")) continue;
    const month = file.replace(/\.json$/, "");
    const report = JSON.parse(readFileSync(join(REPORTS_DIR, file), "utf8"));
    const updates: ProviderUpdate[] = report.providerUpdates ?? [];
    byMonth.set(
      month,
      updates.filter(
        (u) => (u.pricingChanges?.length ?? 0) > 0 || (u.rawPricingData?.length ?? 0) > 0
      )
    );
  }
  return byMonth;
}

const trusted = (b: { providersSampled: number | null }) =>
  isTrustworthyBenchmark({ providersSampled: b.providersSampled ?? undefined });

/**
 * Mirror `loadTrustworthyBenchmarks`: a vertical's Sanity benchmarks when it
 * has any, else the static seed. (The trust gate is applied downstream.)
 */
function benchmarksByVertical(sanity: Benchmark[]): Map<string, Benchmark[]> {
  const out = new Map<string, Benchmark[]>();
  for (const b of sanity) {
    if (!out.has(b.vertical)) out.set(b.vertical, []);
    out.get(b.vertical)!.push(b);
  }
  for (const v of new Set(PRICE_BENCHMARKS.map((b) => b.vertical))) {
    if (out.has(v)) continue;
    out.set(
      v,
      PRICE_BENCHMARKS.filter((b) => b.vertical === v).sort((a, b) =>
        b.month.localeCompare(a.month)
      )
    );
  }
  return out;
}

const seriesLabel = (s: { leadAgeBracket: string; exclusivity: string; leadType: string }) =>
  `${s.leadAgeBracket} / ${s.exclusivity} / ${s.leadType}`;

/**
 * Every aged cell observed for a vertical, trusted or not, so the researcher
 * sees both the series already accruing months and the single-provider
 * observations that did not count.
 */
function agedCellTable(all: Benchmark[], candidates: TrendSeries[]): string[] {
  const order = new Map(candidates.map((c, i) => [c.key, i]));
  const cells = new Map<string, Benchmark[]>();
  for (const b of all) {
    if (!isAgedTrendBracket(b.leadAgeBracket)) continue;
    const k = trendSeriesKey(b);
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k)!.push(b);
  }
  if (cells.size === 0) return ["_No aged cell has ever been observed for this vertical._"];
  const rows = [...cells.entries()].sort(
    ([a], [b]) =>
      (order.get(a) ?? Number.MAX_SAFE_INTEGER) - (order.get(b) ?? Number.MAX_SAFE_INTEGER) ||
      a.localeCompare(b)
  );
  const lines = [
    "| aged cell | trusted months | single-provider months (don't count) | latest trusted median |",
    "|---|---|---|---:|",
  ];
  for (const [key, obs] of rows) {
    const series = candidates.find((c) => c.key === key);
    const trustedMonths = series?.points.map((p) => p.month) ?? [];
    const untrusted = [
      ...new Set(
        obs
          .filter((b) => !trusted(b))
          .map((b) => b.month)
          .filter((m) => !trustedMonths.includes(m))
      ),
    ].sort();
    const latest = series?.points.at(-1);
    lines.push(
      `| ${key.split("|").join(" / ")} | ${trustedMonths.join(", ") || "—"} | ` +
        `${untrusted.join(", ") || "—"} | ${latest ? `$${latest.median} (${latest.month})` : "—"} |`
    );
  }
  return lines;
}

function main(benchmarks: Benchmark[], signals: Map<string, ProviderUpdate[]>) {
  const reliable = benchmarks.filter(
    (b) => (b.providersSampled ?? 0) >= MIN_PROVIDERS
  );
  const byVertical = benchmarksByVertical(benchmarks);
  const verticals = [...byVertical.keys()]
    .filter((v) => byVertical.get(v)!.some(trusted))
    .sort();
  const selection = new Map(
    verticals.map((v) => [v, selectTrendSeries(byVertical.get(v)!)] as const)
  );

  const latestMonth = reliable.length
    ? reliable.map((b) => b.month).sort().at(-1)!
    : "(none)";

  const out: string[] = [];

  out.push("# Lead Price Index — Q3 research brief");
  out.push("");
  out.push(
    "> Generated by `npm run price-index:gap`. Do not edit by hand — regenerate."
  );
  out.push("");
  out.push(
    "The Price Index is a **quarterly human-verified study**. This brief does not " +
      "estimate prices and no script publishes benchmarks; it scopes the research so " +
      "the study is a checklist instead of an open-ended dig."
  );
  out.push("");
  out.push(`- Benchmark documents in Sanity: **${benchmarks.length}**`);
  out.push(
    `- Clearing the ${MIN_PROVIDERS}-provider trust gate: **${reliable.length}**`
  );
  out.push(`- Latest reliable month: **${latestMonth}**`);
  out.push("");

  // ── Trend-chart unlock ────────────────────────────────────────────
  out.push("## The unlock: trend charts");
  out.push("");
  out.push(
    "A `/price-index/{vertical}` page draws `PriceTrendChart` from **one aged series** — a single " +
      "`31-85-days` or `86-180-days` cell (one exclusivity + lead type) tracked across months — and " +
      `only once that series has **${TREND_CHART_MIN_MONTHS} trust-passing months** ` +
      `(\`providersSampled >= ${MIN_PROVIDERS}\`). Real-time cells never produce a chart, and months ` +
      "from different cells do not add up. The rule is `selectTrendSeries` in " +
      "`lib/price-trend-series.ts`, the same function the page renders from."
  );
  out.push("");
  out.push("| vertical | best aged series | trusted months | has chart | months needed |");
  out.push("|---|---|---:|:---:|---:|");
  const byNeeded = new Map<number, number>();
  for (const v of verticals) {
    const sel = selection.get(v)!;
    byNeeded.set(sel.monthsNeeded, (byNeeded.get(sel.monthsNeeded) ?? 0) + 1);
    out.push(
      `| \`${v}\` | ${sel.series ? seriesLabel(sel.series) : "_none_"} | ${sel.months} | ` +
        `${sel.hasChart ? "yes" : "**no**"} | ${sel.monthsNeeded || "—"} |`
    );
  }
  out.push("");
  const charted = byNeeded.get(0) ?? 0;
  const oneAway = byNeeded.get(1) ?? 0;
  const further = [...byNeeded.entries()]
    .filter(([n]) => n > 1)
    .sort(([a], [b]) => a - b)
    .map(([n, c]) => `${c} need ${n} more months`);
  out.push(
    `**${charted} of ${verticals.length} vertical(s) render a trend chart; ` +
      `${oneAway} are exactly one verified month away` +
      (further.length ? `; ${further.join("; ")}` : "") +
      ".**"
  );
  out.push("");

  // ── Per-vertical aged-cell checklist ──────────────────────────────
  out.push("## What to re-price, by vertical");
  out.push("");
  out.push(
    "For each vertical without a chart, the **aged cell to re-observe** — the series the page would " +
      `chart once it reaches ${TREND_CHART_MIN_MONTHS} trusted months. Price exactly that bracket + ` +
      `exclusivity + lead type, from at least ${MIN_PROVIDERS} providers, or the month does not count. ` +
      "Real-time cells are deliberately omitted: they feed the price tables, never the trend chart."
  );
  out.push("");
  for (const v of verticals) {
    const sel = selection.get(v)!;
    const all = byVertical.get(v)!;
    out.push(`### \`${v}\``);
    out.push("");
    if (sel.hasChart && sel.series) {
      out.push(
        `Has a chart (${seriesLabel(sel.series)}, ${sel.months} months). ` +
          "Re-pricing this cell keeps it current; no unlock at stake."
      );
      out.push("");
      continue;
    }
    if (sel.series) {
      out.push(
        `**Target: ${seriesLabel(sel.series)}** — ${sel.months} trusted month(s), ` +
          `needs **${sel.monthsNeeded}** more.`
      );
    } else {
      out.push(
        "**Target: 31-85-days / shared / internet-form** (the page's preferred series) — " +
          `no trust-passing aged cell yet, needs **${TREND_CHART_MIN_MONTHS}** months.`
      );
    }
    out.push("");
    out.push(...agedCellTable(all, buildAgedTrendSeries(all)));
    out.push("");
  }

  // ── Collected signals ─────────────────────────────────────────────
  out.push("## Pricing signals already collected");
  out.push("");
  out.push(
    "`marketwatch` monitors provider sites monthly and records observed pricing. These are " +
      "**leads for the research, not benchmarks** — a single provider's published price does not " +
      "clear the trust gate on its own. Verify against the live site before using."
  );
  out.push("");
  for (const [month, updates] of [...signals.entries()].sort()) {
    out.push(`### ${month} — ${updates.length} provider(s) with signals`);
    out.push("");
    if (updates.length === 0) {
      out.push("_No signals collected. (2026-07 was the retired-model crash.)_");
      out.push("");
      continue;
    }
    for (const u of updates) {
      out.push(`**${u.providerName}**`);
      for (const raw of u.rawPricingData ?? []) {
        if (typeof raw === "string") {
          out.push(`- ${raw}`);
        } else {
          const parts = [raw.vertical, raw.ageBracket, raw.leadType]
            .filter(Boolean)
            .join(" / ");
          out.push(`- ${parts || "unspecified"} — **${raw.priceRange ?? "?"}**`);
        }
      }
      out.push("");
    }
  }

  writeFileSync(OUT_PATH, out.join("\n"));
  console.log(`Wrote ${OUT_PATH}`);
  console.log(
    `${reliable.length}/${benchmarks.length} reliable benchmarks; ` +
      `${charted} vertical(s) with a trend chart, ${oneAway} one month away.`
  );
}

fetchBenchmarks()
  .then((benchmarks) => main(benchmarks, loadProviderSignals()))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
