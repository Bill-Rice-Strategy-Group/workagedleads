import type { GscPropertyKey } from "./gsc-trend";

/**
 * The Search Console properties the trend cron reads.
 *
 * Declared in code rather than as a comma-separated env var, matching
 * BRSG_PROPERTIES in the billricestrategy.com repo. An env string would carry
 * only the site URL — losing the stable join key the snapshot rows are keyed
 * on, the label, and the retirement date. This list changes when a domain
 * migrates, not per environment, so it belongs in git where the diff records
 * when a property was added or dropped.
 */
export interface GscPropertyConfig {
  key: GscPropertyKey;
  /** sc-domain: or URL-prefix form, exactly as registered in Search Console. */
  gscSiteUrl: string;
  label: string;
  /** Stop reading this property after this date. History for it is retained. */
  retiredAfter?: string; // YYYY-MM-DD
  /**
   * Date the property was verified in Search Console (YYYY-MM-DD).
   *
   * These queries carry no dimensions, so the API answers with a single
   * aggregate row — an all-zero row, never an empty result — for a property it
   * has not aggregated yet. The response alone cannot distinguish that from a
   * genuinely silent week. Knowing when we started asking can.
   */
  verifiedOn?: string;
  /**
   * Full page URLs recorded in every snapshot whatever their rank, so a page
   * whose movement answers a specific question has an unbroken daily series.
   * topPages alone cannot do this: it keeps the top 10 by clicks, and a page
   * stuck deep with few clicks falls out of it for days at a time.
   */
  watchPages?: string[];
}

/** Days after verification during which an all-zero week means nothing. */
export const GSC_WARMUP_DAYS = 21;

/** True while an all-zero read on this property should be read as "no reading". */
export function inWarmup(prop: GscPropertyConfig, today: string): boolean {
  if (!prop.verifiedOn) return false;
  const ms = Date.parse(today) - Date.parse(prop.verifiedOn);
  return Math.floor(ms / 86_400_000) <= GSC_WARMUP_DAYS;
}

export const GSC_PROPERTIES: GscPropertyConfig[] = [
  {
    // Kept through the migration so the series has continuity rather than a
    // cliff. Retire once its numbers have fully drained into workagedleads.com
    // — roughly 60-90 days after the 2026-08-03 cutover.
    key: "agedleadsales",
    gscSiteUrl: "sc-domain:agedleadsales.com",
    label: "Aged Lead Sales (retiring)",
  },
  {
    // Added 2026-10-07, the day the Change of Address was finally filed.
    //
    // This domain was invisible to our own instrumentation for the entire
    // migration — it appears in none of the 148 snapshots taken before today —
    // which is why nobody noticed it never got a Change of Address while the
    // other two did. Baseline on the day of filing: 389 impressions over five
    // days at positions 7.2-17.1 and ZERO clicks, the signature of redirect
    // limbo rather than of bad pages.
    //
    // Registered as a URL-prefix property, not sc-domain. That matters: a
    // sc-domain property cannot always accept a Change of Address, and this one
    // could.
    key: "howtoworkleads",
    gscSiteUrl: "https://howtoworkleads.com/",
    label: "How To Work Leads (migrating)",
  },
  {
    key: "workagedleads",
    gscSiteUrl: "sc-domain:workagedleads.com",
    label: "Work Aged Leads",
    verifiedOn: "2026-08-03",
    // The page whose movement says whether the consolidation moved rankings:
    // ~36% of the merged site's pre-cutover impressions (BACKLOG 2026-08-05).
    // Between 2026-10-01 and 11-14 it was missing from topPages on 25 of 45
    // days, because it ranks ~47 and earns few clicks.
    watchPages: ["https://workagedleads.com/lead-types/life-insurance-leads"],
  },
];

/** Properties still being read on the given date. */
export function activeProperties(today: string): GscPropertyConfig[] {
  return GSC_PROPERTIES.filter((p) => !p.retiredAfter || today <= p.retiredAfter);
}
