import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  evaluatePriceIndexAge,
  PRICE_INDEX_MAX_AGE_DAYS,
  latestPublishedMonth,
  studyAgeDays,
} from "./price-index-check";

describe("evaluatePriceIndexAge", () => {
  test("a fresh study is ok with no reminder", () => {
    const v = evaluatePriceIndexAge(PRICE_INDEX_MAX_AGE_DAYS);
    assert.equal(v.ok, true);
    assert.equal(v.reminder, false);
  });

  test("an overdue study is a reminder, never a failure", () => {
    // A late study is a human publishing task. Reporting it as a failing check
    // sent a daily "[ALERT] 1 Work Aged Leads cron failing" email with no
    // failing cron behind it (2026-10-05 through 2026-11-18).
    const v = evaluatePriceIndexAge(262);
    assert.equal(v.ok, true);
    assert.equal(v.reminder, true);
    assert.match(v.detail, /262d old/);
    assert.match(v.detail, /human publishing task/);
  });

  test("the reminder starts the day after the quarterly threshold", () => {
    assert.equal(evaluatePriceIndexAge(PRICE_INDEX_MAX_AGE_DAYS + 1).reminder, true);
  });
});

describe("measuring the PUBLISHED study, not the Sanity docs", () => {
  /**
   * The 2026-10-07 bug. The health check read Sanity's machine-written
   * priceBenchmark docs (newest 2026-06-01, 128 days) while the study readers
   * actually see — data/price-benchmarks.ts — was month 2026-03, 220 days old.
   * The daily alert reported the comfortable number, understating the staleness
   * of the published artifact by 92 days.
   */
  test("picks the newest month from the published set", () => {
    assert.equal(
      latestPublishedMonth([{ month: "2026-03" }, { month: "2026-01" }, { month: "2026-02" }]),
      "2026-03",
    );
  });

  test("dedupes - a study has many benchmarks sharing one month", () => {
    const many = Array.from({ length: 42 }, () => ({ month: "2026-03" }));
    assert.equal(latestPublishedMonth(many), "2026-03");
  });

  test("returns null for an empty set rather than throwing", () => {
    assert.equal(latestPublishedMonth([]), null);
  });

  test("sorts correctly across a year boundary", () => {
    assert.equal(
      latestPublishedMonth([{ month: "2026-09" }, { month: "2026-10" }, { month: "2025-12" }]),
      "2026-10",
    );
  });

  test("age is measured from the FIRST of the month, the conservative reading", () => {
    assert.equal(studyAgeDays("2026-03", new Date("2026-03-31T00:00:00Z")), 30);
  });

  test("reproduces the exact understatement that motivated this", () => {
    const now = new Date("2026-10-07T13:00:00Z");
    const published = studyAgeDays("2026-03", now); // what readers see
    const sanityDocs = studyAgeDays("2026-06", now); // what the check used to read
    assert.equal(published, 220);
    assert.ok(
      published - sanityDocs > 80,
      `published study was ${published - sanityDocs}d older than the docs being measured`,
    );
  });

  test("a published study that is current reports ok", () => {
    const now = new Date("2026-10-07T00:00:00Z");
    const age = studyAgeDays("2026-10", now);
    assert.equal(evaluatePriceIndexAge(age).ok, true);
  });

  test("rejects a malformed month instead of silently returning NaN days", () => {
    assert.throws(() => studyAgeDays("March 2026", new Date()), /YYYY-MM/);
  });
});
