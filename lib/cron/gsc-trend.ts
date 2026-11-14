// Persist a daily snapshot of Google Search Console metrics to
// data/gsc-trend.json in GitHub. The daily-performance cron already fetches GSC
// for its AI summary but throws the raw numbers away — this keeps them so we can
// actually measure CTR/traffic trends over time (e.g. did a title change lift
// CTR? is the disavow recovering rankings?) and feed the prune decision later.
//
// One snapshot per day, keyed by date and idempotent on re-run. Records the
// rolling 7-day window (smoothed, less noisy than single-day GSC which also lags
// ~2 days), plus top pages and queries for per-URL tracking.

import type { GSCReport } from "./gsc-data";

const MAX_SNAPSHOTS = 365; // ~1 year of daily history
const TOP_N = 10; // top pages / queries kept per snapshot

export interface GscTrendMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTrendPage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTrendQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * A page recorded by exact URL. `row: null` means Search Console had no row
 * for it in the window (no impressions) — measured, not missing.
 */
export interface GscTrendWatchedPage {
  page: string;
  row: Omit<GscTrendPage, "page"> | null;
}

/** Stable join key for a property, so a row survives the site URL changing. */
export type GscPropertyKey = "agedleadsales" | "workagedleads" | "howtoworkleads";

/** The property every pre-2026-08-05 row was written against. */
export const LEGACY_PROPERTY: GscPropertyKey = "agedleadsales";

export interface GscTrendSnapshot {
  date: string; // YYYY-MM-DD
  /**
   * Absent on rows written before the consolidation, which were all
   * agedleadsales.com by construction. Read a missing key as LEGACY_PROPERTY;
   * the old rows are deliberately left untouched rather than back-filled.
   */
  property?: GscPropertyKey;
  /**
   * "ok"      — Search Console returned rows; rolling7d is a measurement.
   * "no-data" — it answered 200 with nothing. rolling7d is null.
   *
   * A real quiet week is {status:"ok", rolling7d:{clicks:0,…}}. That is a
   * different fact from "we have no reading", and conflating the two is what
   * made the day after cutover look like a traffic collapse.
   */
  status?: "ok" | "no-data";
  /** Rolling 7-day window totals — the smoothed headline series. */
  rolling7d: GscTrendMetrics | null;
  topPages: GscTrendPage[];
  topQueries: GscTrendQuery[];
  /** Present only for properties configured with watchPages. */
  watchedPages?: GscTrendWatchedPage[];
}

export interface GscTrend {
  lastUpdated: string;
  snapshots: GscTrendSnapshot[];
}

/** Legacy rows carry no property; they were all the one property. */
export function snapshotProperty(s: GscTrendSnapshot): GscPropertyKey {
  return s.property ?? LEGACY_PROPERTY;
}

function round(n: number, dp = 4): number {
  const f = 10 ** dp;
  return Math.round((n || 0) * f) / f;
}

export async function fetchGscTrend(): Promise<GscTrend | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/gsc-trend.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!res.ok) return null; // 404 on first run is expected

    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as GscTrend;
  } catch {
    return null;
  }
}

function buildSnapshot(
  gsc: GSCReport,
  date: string,
  property: GscPropertyKey,
  warmup = false
): GscTrendSnapshot {
  // The gate. Search Console answering with nothing is not a measurement, and
  // writing it as one is permanent — the file is the historical record.
  //
  // Two shapes of "nothing". An empty rows array, and — because these queries
  // carry no dimensions — a single aggregate row of zeros, which is what a
  // property returns before it has been aggregated. The second is only
  // distinguishable from a real quiet week by knowing the property is new.
  const readNothing =
    gsc.sevenDay.metrics.clicks === 0 && gsc.sevenDay.metrics.impressions === 0;

  if (!gsc.sevenDay.hasData || (warmup && readNothing)) {
    return {
      date,
      property,
      status: "no-data",
      rolling7d: null,
      topPages: [],
      topQueries: [],
    };
  }

  const m = gsc.sevenDay.metrics;
  return {
    date,
    property,
    status: "ok",
    rolling7d: {
      clicks: m.clicks || 0,
      impressions: m.impressions || 0,
      ctr: round(m.ctr),
      position: round(m.position, 2),
    },
    topPages: gsc.sevenDay.topPages.slice(0, TOP_N).map((p) => ({
      page: p.page,
      clicks: p.clicks || 0,
      impressions: p.impressions || 0,
      ctr: round(p.ctr),
      position: round(p.position, 2),
    })),
    topQueries: gsc.sevenDay.topQueries.slice(0, TOP_N).map((q) => ({
      query: q.query,
      clicks: q.clicks || 0,
      impressions: q.impressions || 0,
      ctr: round(q.ctr),
      position: round(q.position, 2),
    })),
    ...(gsc.sevenDay.watchedPages
      ? {
          watchedPages: gsc.sevenDay.watchedPages.map((w) => ({
            page: w.page,
            row: w.row
              ? {
                  clicks: w.row.clicks || 0,
                  impressions: w.row.impressions || 0,
                  ctr: round(w.row.ctr),
                  position: round(w.row.position, 2),
                }
              : null,
          })),
        }
      : {}),
  };
}

/**
 * Upsert today's snapshot. Idempotent: re-running on the same day replaces that
 * day's row rather than appending a duplicate. Returns changed=false only when
 * an identical snapshot for today already exists (avoids no-op commits).
 */
export function appendGscSnapshot(
  existing: GscTrend | null,
  gsc: GSCReport,
  date: string,
  property: GscPropertyKey = LEGACY_PROPERTY,
  warmup = false
): { trend: GscTrend; changed: boolean } {
  const snapshot = buildSnapshot(gsc, date, property, warmup);

  // Keyed on (date, property). On date alone, the second property written each
  // day would silently overwrite the first — destroying the side-by-side
  // continuity that tracking two properties exists to provide.
  const sameRow = (s: GscTrendSnapshot) =>
    s.date === date && snapshotProperty(s) === property;

  const snapshots = (existing?.snapshots ?? []).filter((s) => !sameRow(s));
  const prior = existing?.snapshots.find(sameRow);
  const identical = prior && JSON.stringify(prior) === JSON.stringify(snapshot);

  snapshots.push(snapshot);
  snapshots.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      snapshotProperty(a).localeCompare(snapshotProperty(b))
  );

  return {
    trend: {
      lastUpdated: existing?.lastUpdated ?? "",
      snapshots: trimToRecentDates(snapshots, MAX_SNAPSHOTS),
    },
    changed: !identical,
  };
}

/**
 * Retain the most recent N *dates*, not N rows.
 *
 * MAX_SNAPSHOTS has always meant "about a year of history". Trimming by row
 * count would quietly halve that to six months the moment a second property
 * starts writing a row a day — a regression introduced by the very feature
 * meant to protect the history.
 */
export function trimToRecentDates(
  snapshots: GscTrendSnapshot[],
  maxDates: number
): GscTrendSnapshot[] {
  const dates = [...new Set(snapshots.map((s) => s.date))].sort();
  if (dates.length <= maxDates) return snapshots;
  const keepFrom = dates[dates.length - maxDates];
  return snapshots.filter((s) => s.date >= keepFrom);
}

export function serializeGscTrend(trend: GscTrend, nowIso: string): string {
  return JSON.stringify({ ...trend, lastUpdated: nowIso }, null, 2) + "\n";
}
