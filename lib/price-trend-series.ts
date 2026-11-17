/**
 * Which observed series a /price-index/[vertical] trend chart plots, and
 * whether there is one at all.
 *
 * Single source of truth for two consumers that used to disagree:
 *   - `app/(site)/price-index/[vertical]/page.tsx` — renders the chart
 *   - `scripts/price-index-gap.ts` — the research brief that says which
 *     verticals are close to a chart and which cells to re-price
 *
 * The gap script once counted distinct months across ANY trust-passing cell,
 * so a real-time benchmark could "complete" a chart the page would never
 * draw (health-insurance, 2026-11). Both now call `selectTrendSeries`.
 *
 * The rule:
 *   - aged cells only (`31-85-days`, `86-180-days`) — real-time never charts
 *   - trust-passing only (`providersSampled >= 2`)
 *   - one series = one bracket + exclusivity + leadType across months, so the
 *     line never mixes denominators
 *   - best series = most distinct months; ties prefer 31–85-day, then shared,
 *     then internet-form
 *   - a chart needs `TREND_CHART_MIN_MONTHS` months in that one series
 *
 * Pure and dependency-free (relative imports only) so a `tsx` script can use it.
 */

import { isTrustworthyBenchmark } from "../data/price-benchmarks";

export const AGED_TREND_BRACKETS = ["31-85-days", "86-180-days"] as const;

/** Two points is not a trend. `PriceTrendChart` also refuses below this. */
export const TREND_CHART_MIN_MONTHS = 3;

export interface TrendBenchmarkInput {
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  month: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled?: number | null;
}

/** Structurally identical to `PriceTrendPoint` in `components/price-trend-chart.tsx`. */
export interface TrendPoint {
  month: string;
  low: number;
  median: number;
  high: number;
}

export interface TrendSeries {
  key: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  /** One point per distinct month, oldest first. */
  points: TrendPoint[];
}

export const trendSeriesKey = (b: {
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
}) => `${b.leadAgeBracket}|${b.exclusivity}|${b.leadType}`;

export function isAgedTrendBracket(bracket: string): boolean {
  return (AGED_TREND_BRACKETS as readonly string[]).includes(bracket);
}

function compareSeries(a: TrendSeries, b: TrendSeries): number {
  const d = b.points.length - a.points.length;
  if (d !== 0) return d;
  const bracketRank = (s: TrendSeries) => (s.leadAgeBracket === "31-85-days" ? 0 : 1);
  const sharedRank = (s: TrendSeries) => (s.exclusivity === "shared" ? 0 : 1);
  const formRank = (s: TrendSeries) => (s.leadType === "internet-form" ? 0 : 1);
  return (
    bracketRank(a) - bracketRank(b) ||
    sharedRank(a) - sharedRank(b) ||
    formRank(a) - formRank(b) ||
    a.key.localeCompare(b.key)
  );
}

/**
 * Every candidate aged series for one vertical's benchmarks, best first.
 * Applies the trust gate itself, so callers cannot forget it. When a cell has
 * more than one benchmark for the same month, the first one in input order
 * wins (the page's query orders `month desc`).
 */
export function buildAgedTrendSeries(
  benchmarks: readonly TrendBenchmarkInput[]
): TrendSeries[] {
  const byKey = new Map<string, TrendSeries & { seen: Map<string, TrendPoint> }>();
  for (const b of benchmarks) {
    if (!isAgedTrendBracket(b.leadAgeBracket)) continue;
    if (!isTrustworthyBenchmark({ providersSampled: b.providersSampled ?? undefined })) continue;
    if (typeof b.priceMedian !== "number") continue;
    const key = trendSeriesKey(b);
    let s = byKey.get(key);
    if (!s) {
      s = {
        key,
        leadAgeBracket: b.leadAgeBracket,
        exclusivity: b.exclusivity,
        leadType: b.leadType,
        points: [],
        seen: new Map(),
      };
      byKey.set(key, s);
    }
    if (!s.seen.has(b.month)) {
      s.seen.set(b.month, {
        month: b.month,
        low: b.priceLow,
        median: b.priceMedian,
        high: b.priceHigh,
      });
    }
  }
  return [...byKey.values()]
    .map(({ seen, ...s }) => ({
      ...s,
      points: [...seen.values()].sort((a, b) => a.month.localeCompare(b.month)),
    }))
    .sort(compareSeries);
}

export interface TrendSelection {
  /** Best-covered aged series, or null when the vertical has none. */
  series: TrendSeries | null;
  /** True when the page renders `PriceTrendChart`. */
  hasChart: boolean;
  /** Trust-passing months in the best series. */
  months: number;
  /** More verified months of `series` needed before a chart renders. */
  monthsNeeded: number;
}

export function selectTrendSeries(
  benchmarks: readonly TrendBenchmarkInput[]
): TrendSelection {
  const series = buildAgedTrendSeries(benchmarks)[0] ?? null;
  const months = series?.points.length ?? 0;
  return {
    series,
    hasChart: months >= TREND_CHART_MIN_MONTHS,
    months,
    monthsNeeded: Math.max(0, TREND_CHART_MIN_MONTHS - months),
  };
}
