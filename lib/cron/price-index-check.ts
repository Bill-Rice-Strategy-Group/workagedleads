/**
 * Freshness verdict for the Lead Price Index study.
 *
 * A REMINDER, NOT A FAILURE (2026-11-18)
 *
 * The study is a quarterly human publishing task. It used to fail the daily
 * health check once it went overdue, which sent the same "[ALERT] N Work Aged
 * Leads cron failing" email a genuine cron failure sends. From 2026-10-05 (when
 * the dated snooze expired) that email went out every day for one reason only:
 * the study was late. No cron had failed. An alert that fires daily for
 * something no cron can fix trains the reader to skim past exactly the email
 * that would carry a real failure.
 *
 * So an overdue study is now `ok: true, reminder: true`. The health check does
 * not count it as failing and never sends an email for it alone; when a real
 * failure does send the email, the reminder rides along in its own row. The
 * task itself is tracked where tasks belong: BACKLOG.md ("Publish the quarterly
 * Lead Price Index study"), which the BRSG portfolio report reads.
 */

/** The study is judged on its own quarterly cadence. */
export const PRICE_INDEX_MAX_AGE_DAYS = 100;

export interface PriceIndexVerdict {
  /** Always true: a late study is not a cron failure. */
  ok: boolean;
  /** True when the study is overdue and a human needs to publish it. */
  reminder: boolean;
  detail: string;
}

export function evaluatePriceIndexAge(ageDays: number): PriceIndexVerdict {
  if (ageDays <= PRICE_INDEX_MAX_AGE_DAYS) {
    return { ok: true, reminder: false, detail: `Latest benchmark published ${ageDays}d ago` };
  }

  return {
    ok: true,
    reminder: true,
    detail:
      `Benchmarks are ${ageDays}d old — the quarterly Lead Price Index study is due. ` +
      `This is a human publishing task, not a cron failure; it is tracked in BACKLOG.md ` +
      `and does not trigger this alert on its own.`,
  };
}

/**
 * The newest month present in the PUBLISHED study, or null when empty.
 *
 * Separated from the health-check route so it can be tested. The bug this
 * guards against was not in the arithmetic — it was in WHICH artifact got
 * measured. The route used to read Sanity's machine-written priceBenchmark
 * docs; the study readers actually see is data/price-benchmarks.ts. On
 * 2026-10-07 those disagreed by 92 days, and the alert reported the smaller
 * number.
 */
export function latestPublishedMonth(benchmarks: { month: string }[]): string | null {
  if (benchmarks.length === 0) return null;
  return [...new Set(benchmarks.map((b) => b.month))].sort().pop() ?? null;
}

/**
 * Age in days of a "YYYY-MM" study month, measured from the FIRST of that
 * month — the conservative reading. A study stamped 2026-03 is at least as old
 * as 2026-03-01, and claiming it is newer than that is the direction of error
 * this whole check exists to avoid.
 */
export function studyAgeDays(month: string, now: Date): number {
  const started = Date.parse(`${month}-01T00:00:00Z`);
  if (Number.isNaN(started)) throw new Error(`Not a YYYY-MM month: ${month}`);
  return Math.floor((now.getTime() - started) / 86_400_000);
}
