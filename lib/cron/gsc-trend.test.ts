import { test } from "node:test";
import assert from "node:assert/strict";

import {
  appendGscSnapshot,
  trimToRecentDates,
  snapshotProperty,
  type GscTrend,
  type GscTrendSnapshot,
} from "./gsc-trend";
import type { GSCReport, GSCMetrics } from "./gsc-data";

const zero: GSCMetrics = { clicks: 0, impressions: 0, ctr: 0, position: 0 };

/** A report the way fetchGSCReport builds it when Search Console had rows. */
function reportWithData(clicks: number, impressions: number): GSCReport {
  const metrics: GSCMetrics = {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: 12.5,
  };
  return {
    sevenDay: {
      hasData: true,
      metrics,
      dailyAverage: metrics,
      topQueries: [],
      topPages: [{ page: "/a", clicks, impressions, ctr: 0.1, position: 12.5 }],
      devices: [],
    },
    ninetyDay: {
      hasData: true,
      metrics,
      dailyAverage: metrics,
      topQueries: [],
      topPages: [],
      devices: [],
    },
    available: true,
  };
}

/** HTTP 200, empty rows — the shape a freshly verified property returns. */
function reportWithNoData(): GSCReport {
  const period = {
    hasData: false,
    metrics: zero,
    dailyAverage: zero,
    topQueries: [],
    topPages: [],
    devices: [],
  };
  return { sevenDay: period, ninetyDay: period, available: true };
}

test("a 200 with no rows is never recorded as a measured zero", () => {
  const { trend } = appendGscSnapshot(
    null,
    reportWithNoData(),
    "2026-08-04",
    "workagedleads"
  );

  const row = trend.snapshots[0];
  assert.equal(row.status, "no-data");
  assert.equal(row.rolling7d, null, "no-data must not carry a metrics object");
  assert.deepEqual(row.topPages, []);
});

test("an all-zero row on a warming-up property is no-data, not a zero", () => {
  // These queries carry no dimensions, so GSC answers with one aggregate row.
  // A property it has not aggregated yet returns that row full of zeros — the
  // case that wrote workagedleads.com into the record as a dead site.
  const { trend } = appendGscSnapshot(
    null,
    reportWithData(0, 0),
    "2026-08-05",
    "workagedleads",
    true // within the verification warmup window
  );

  const row = trend.snapshots[0];
  assert.equal(row.status, "no-data");
  assert.equal(row.rolling7d, null);
});

test("an all-zero row on an established property stays a real zero", () => {
  const { trend } = appendGscSnapshot(
    null,
    reportWithData(0, 0),
    "2026-08-05",
    "agedleadsales",
    false // not in warmup — this is a measurement
  );

  const row = trend.snapshots[0];
  assert.equal(row.status, "ok");
  assert.equal(row.rolling7d?.impressions, 0);
});

test("a genuine quiet week stays expressible as a real zero", () => {
  const { trend } = appendGscSnapshot(
    null,
    reportWithData(0, 0),
    "2026-08-04",
    "workagedleads"
  );

  const row = trend.snapshots[0];
  assert.equal(row.status, "ok");
  assert.deepEqual(row.rolling7d?.clicks, 0);
  assert.notEqual(row.rolling7d, null, "measured zero is data, not absence");
});

test("two properties on the same date produce two rows, not an overwrite", () => {
  const first = appendGscSnapshot(
    null,
    reportWithData(37, 4461),
    "2026-08-04",
    "agedleadsales"
  );
  const second = appendGscSnapshot(
    first.trend,
    reportWithNoData(),
    "2026-08-04",
    "workagedleads"
  );

  const rows = second.trend.snapshots.filter((s) => s.date === "2026-08-04");
  assert.equal(rows.length, 2);

  const old = rows.find((r) => snapshotProperty(r) === "agedleadsales");
  const fresh = rows.find((r) => snapshotProperty(r) === "workagedleads");
  assert.equal(old?.rolling7d?.clicks, 37, "the readable property survives");
  assert.equal(fresh?.rolling7d, null, "the quiet one does not overwrite it");
});

test("re-running the same property on the same day is idempotent", () => {
  const first = appendGscSnapshot(
    null,
    reportWithData(10, 100),
    "2026-08-04",
    "workagedleads"
  );
  const again = appendGscSnapshot(
    first.trend,
    reportWithData(10, 100),
    "2026-08-04",
    "workagedleads"
  );

  assert.equal(again.changed, false, "identical re-run must not commit");
  assert.equal(again.trend.snapshots.length, 1);
});

test("legacy rows carrying no property do not collide with the new one", () => {
  const legacy: GscTrendSnapshot = {
    date: "2026-08-04",
    rolling7d: { clicks: 37, impressions: 4461, ctr: 0.008, position: 23.1 },
    topPages: [],
    topQueries: [],
  };
  const existing: GscTrend = { lastUpdated: "", snapshots: [legacy] };

  const { trend } = appendGscSnapshot(
    existing,
    reportWithData(1, 2),
    "2026-08-04",
    "workagedleads"
  );

  assert.equal(trend.snapshots.length, 2, "legacy row must be preserved");
  assert.equal(
    trend.snapshots.find((s) => s.property === undefined)?.rolling7d?.clicks,
    37
  );
});

test("a legacy row IS replaced when the same property writes that date", () => {
  const legacy: GscTrendSnapshot = {
    date: "2026-08-04",
    rolling7d: { clicks: 37, impressions: 4461, ctr: 0.008, position: 23.1 },
    topPages: [],
    topQueries: [],
  };
  const existing: GscTrend = { lastUpdated: "", snapshots: [legacy] };

  const { trend } = appendGscSnapshot(
    existing,
    reportWithData(5, 50),
    "2026-08-04",
    "agedleadsales"
  );

  assert.equal(trend.snapshots.length, 1, "same (date, property) upserts");
  assert.equal(trend.snapshots[0].rolling7d?.clicks, 5);
});

test("trimming retains N dates, keeping every property's row for them", () => {
  const snapshots: GscTrendSnapshot[] = [];
  for (let d = 1; d <= 10; d++) {
    const date = `2026-08-${String(d).padStart(2, "0")}`;
    for (const property of ["agedleadsales", "workagedleads"] as const) {
      snapshots.push({
        date,
        property,
        status: "ok",
        rolling7d: { clicks: d, impressions: d * 10, ctr: 0.1, position: 5 },
        topPages: [],
        topQueries: [],
      });
    }
  }

  const kept = trimToRecentDates(snapshots, 4);

  const dates = [...new Set(kept.map((s) => s.date))];
  assert.equal(dates.length, 4, "trims by distinct dates, not row count");
  assert.equal(kept.length, 8, "both properties survive for each kept date");
  assert.deepEqual(dates.sort(), [
    "2026-08-07",
    "2026-08-08",
    "2026-08-09",
    "2026-08-10",
  ]);
});

test("watched pages are recorded even when absent from topPages", () => {
  const base = reportWithData(5, 500);
  const report: GSCReport = {
    ...base,
    sevenDay: {
      ...base.sevenDay,
      watchedPages: [
        {
          page: "https://x/watched",
          row: { page: "https://x/watched", clicks: 1, impressions: 300, ctr: 0.00333, position: 47.871 },
        },
        { page: "https://x/silent", row: null },
      ],
    },
  };
  const { trend } = appendGscSnapshot(null, report, "2026-11-15", "workagedleads");
  const row = trend.snapshots[0];
  assert.deepEqual(row.watchedPages, [
    { page: "https://x/watched", row: { clicks: 1, impressions: 300, ctr: 0.0033, position: 47.87 } },
    { page: "https://x/silent", row: null },
  ]);
});

test("a property without watchPages writes no watchedPages key", () => {
  const { trend } = appendGscSnapshot(null, reportWithData(5, 500), "2026-11-15", "workagedleads");
  assert.equal("watchedPages" in trend.snapshots[0], false);
});
