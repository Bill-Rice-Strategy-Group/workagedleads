import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildAgedTrendSeries,
  selectTrendSeries,
  TREND_CHART_MIN_MONTHS,
  type TrendBenchmarkInput,
} from "./price-trend-series";

const cell = (
  month: string,
  leadAgeBracket: string,
  providersSampled: number | null,
  exclusivity = "shared",
  leadType = "internet-form",
  priceMedian = 5
): TrendBenchmarkInput => ({
  month,
  leadAgeBracket,
  exclusivity,
  leadType,
  priceLow: priceMedian - 1,
  priceMedian,
  priceHigh: priceMedian + 1,
  providersSampled,
});

test("months from different cells do not add up to a chart (health-insurance, 2026-11)", () => {
  // The exact shape that made the gap script report "has chart: yes" while the
  // live page showed the no-trend panel: one trusted aged month, three
  // single-provider aged months, and trusted real-time months.
  const health = [
    cell("2026-11", "real-time", 2, "exclusive"),
    cell("2026-06", "31-85-days", 1),
    cell("2026-05", "31-85-days", 1),
    cell("2026-04", "31-85-days", 1),
    cell("2026-04", "real-time", 3),
    cell("2026-03", "31-85-days", 2),
  ];
  const sel = selectTrendSeries(health);
  assert.equal(sel.hasChart, false);
  assert.equal(sel.months, 1);
  assert.equal(sel.monthsNeeded, TREND_CHART_MIN_MONTHS - 1);
  assert.equal(sel.series?.key, "31-85-days|shared|internet-form");
});

test("real-time cells never produce a chart", () => {
  const rt = ["2026-03", "2026-04", "2026-05", "2026-06"].map((m) =>
    cell(m, "real-time", 5)
  );
  const sel = selectTrendSeries(rt);
  assert.equal(sel.series, null);
  assert.equal(sel.hasChart, false);
  assert.equal(sel.monthsNeeded, TREND_CHART_MIN_MONTHS);
});

test("three trusted months in one aged series render a chart, oldest first", () => {
  const sel = selectTrendSeries([
    cell("2026-06", "86-180-days", 2),
    cell("2026-03", "86-180-days", 3),
    cell("2026-04", "86-180-days", 2),
  ]);
  assert.equal(sel.hasChart, true);
  assert.equal(sel.monthsNeeded, 0);
  assert.deepEqual(
    sel.series?.points.map((p) => p.month),
    ["2026-03", "2026-04", "2026-06"]
  );
});

test("exclusivity and lead type split series", () => {
  const sel = selectTrendSeries([
    cell("2026-03", "31-85-days", 2, "shared"),
    cell("2026-04", "31-85-days", 2, "exclusive"),
    cell("2026-05", "31-85-days", 2, "shared", "direct-mail"),
  ]);
  assert.equal(sel.months, 1);
  assert.equal(sel.hasChart, false);
});

test("best series = most months, then 31-85 > 86-180, shared, internet-form", () => {
  const series = buildAgedTrendSeries([
    cell("2026-03", "86-180-days", 2),
    cell("2026-04", "86-180-days", 2),
    cell("2026-03", "31-85-days", 2, "exclusive"),
    cell("2026-03", "31-85-days", 2, "shared", "direct-mail"),
    cell("2026-03", "31-85-days", 2),
  ]);
  assert.deepEqual(
    series.map((s) => s.key),
    [
      "86-180-days|shared|internet-form",
      "31-85-days|shared|internet-form",
      "31-85-days|shared|direct-mail",
      "31-85-days|exclusive|internet-form",
    ]
  );
});

test("duplicate cell in one month: first in input order wins", () => {
  const [s] = buildAgedTrendSeries([
    cell("2026-03", "31-85-days", 2, "shared", "internet-form", 7),
    cell("2026-03", "31-85-days", 2, "shared", "internet-form", 9),
  ]);
  assert.equal(s.points.length, 1);
  assert.equal(s.points[0].median, 7);
});
