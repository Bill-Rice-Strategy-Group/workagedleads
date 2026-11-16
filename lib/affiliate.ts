import { AFFILIATE_UTM_SOURCE } from "./utm";

const AFFILIATE_BASE_URL = "https://agedleadstore.com";
const UTM_SOURCE = AFFILIATE_UTM_SOURCE;
const UTM_MEDIUM = "affiliate";

/** The monetized host. Every click here pays; every other outbound host does not. */
export const AFFILIATE_DOMAIN = "agedleadstore.com";

/**
 * True for the monetized host and any subdomain of it.
 *
 * The partner sells across two hosts: on-site CTAs built here link to the apex
 * `agedleadstore.com`, while the newsletter's vertical strip
 * (`lib/newsletter/store-links.ts`) deep-links to
 * `store.agedleadstore.com/{segment}/leads`. GA4 reports those as two different
 * `linkDomain` values.
 *
 * Anything comparing a reported domain against the affiliate host must use this
 * rather than `===`. An exact comparison gets both halves of the scoreboard
 * wrong in the same direction it is measured: storefront clicks drop out of the
 * affiliate total, and — because leakage is defined as "every domain that is not
 * the affiliate domain" — those same clicks get counted as leakage to a
 * competitor. CLICK-LOOP.md fires a flag condition when leakage exceeds the
 * affiliate total, so the bug could raise an alarm *because* the newsletter was
 * working.
 */
export function isAffiliateDomain(domain: string): boolean {
  return domain === AFFILIATE_DOMAIN || domain.endsWith(`.${AFFILIATE_DOMAIN}`);
}

interface AffiliateLink {
  path?: string;
  campaign: string;
  content: string;
}

export function affiliateUrl({ path = "/all-lead-types/", campaign, content }: AffiliateLink): string {
  const base = `${AFFILIATE_BASE_URL}${path}`;
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${base}?${params.toString()}`;
}

export function affiliateRegisterUrl(campaign: string, content: string): string {
  return affiliateUrl({ path: "/register", campaign, content });
}

/**
 * Lead type → the matching Aged Lead Store landing page.
 *
 * Keyed by the Sanity `leadType.title` normalised to a slug ("Mortgage Leads"
 * → "mortgage-leads"), because that title is what every caller actually has.
 *
 * THE AUTHORITATIVE SOURCE IS THE PARTNER'S "Buy Aged Leads" NAV DROPDOWN, on
 * any page of agedleadstore.com. Those are the pages they have chosen to sell
 * from. Re-derive this map from that menu; do not infer it from URL patterns.
 *
 * A 200 is NOT sufficient verification, and this map got it wrong once by
 * treating it as if it were. agedleadstore.com publishes an article and a
 * buy page under confusingly parallel slugs, so several plausible guesses
 * return 200 while being editorial content:
 *
 *   /insurance-leads/            200  "Insurance Leads Generation Tips…"      (article)
 *   /mortgage-leads/             200  "Mortgage Leads Archives"               (tag archive)
 *   /home-improvement-leads/     200  "…Everything You Need to Know"          (article)
 *   /online-final-expense-leads/ 200  "Converting Online Final Expense Leads…" (article)
 *   /solar-installation-leads/   200  "Aged Solar Installation Leads: What…"  (article)
 *
 * Sending purchase intent to any of those is a silent conversion leak — the
 * link works, the visitor lands on a blog post, and nothing looks broken.
 * Check the nav AND the page title before adding an entry.
 *
 * Two mappings look wrong and are not: the partner's own menu points **Final
 * Expense Leads** at `/life-insurance-leads/` (final expense is life
 * insurance), and Home Improvement at a dedicated `-lp` landing page.
 *
 * Medicare is absent BY DECISION, not by oversight. Troy is not selling it, so
 * it routes to the full catalogue on purpose. Do not "fix" this by inventing a
 * path. The generic "Insurance Leads" bucket is unmapped for a different
 * reason: there is no generic-insurance buy page to point at.
 *
 * SOLAR IS NOW STOCKED. The 2026-08-06 note here said Troy sold neither
 * Medicare nor solar; the card grid at /all-lead-types/ carried a Solar
 * Installation card on 2026-08-27, so that half is out of date. It still falls
 * back to the catalogue because there is no *marketing* buy page for it — the
 * card links straight into the storefront at
 * store.agedleadstore.com/solar_installation/leads, which this map (marketing
 * paths only) has no slot for. The newsletter already deep-links it via
 * lib/newsletter/store-links.ts. Giving the site's solar lead-type page the
 * same treatment is a live opportunity, not a bug to paper over.
 *
 * Verified 200 with zero redirects on 2026-08-06, and the destination set was
 * reviewed and confirmed correct by Bill the same day.
 */
const STORE_CATEGORY_PATHS: Record<string, string> = {
  "mortgage-leads": "/mortgage-leads-purchase-refinance/",
  "auto-insurance-leads": "/auto-insurance-leads/",
  "health-insurance-leads": "/health-insurance-leads/",
  "life-insurance-leads": "/life-insurance-leads/",
  // Per the partner's menu — final expense IS life insurance to them.
  "final-expense-leads": "/life-insurance-leads/",
  "iul-leads": "/indexed-universal-life-insurance-leads/",
  // MVA (motor-vehicle accident) and SSDI are both attorney-intake products.
  "mva-leads": "/legal-leads/",
  "ssdi-leads": "/legal-leads/",
  // The category itself. Same destination as its two sub-verticals — the
  // partner sells all legal intake from one page, verified in their nav and
  // by page title ("Legal Leads: Everything You Need to Know") on 2026-08-12.
  "legal-leads": "/legal-leads/",
  "home-improvement-leads": "/buy-home-improvement-leads-lp/",
  // Legacy slug: the lead-type route 301s to home-improvement-leads, but older
  // content still carries this label.
  "home-services-leads": "/buy-home-improvement-leads-lp/",
  "aca-leads": "/aca-leads/",
  "obamacare-leads": "/obamacare-leads/",
  "homeowners-insurance-leads": "/homeowner-insurance-leads/",
  // Short aliases kept for the pre-2026-08 call sites that passed bare keys.
  auto: "/auto-insurance-leads/",
  home: "/buy-home-improvement-leads-lp/",
  // "insurance-leads" (the generic bucket), "medicare-leads" and "solar-leads"
  // are intentionally unmapped — the partner has no generic-insurance, Medicare
  // or solar buy page. They fall back to /all-lead-types/.
};

/**
 * The category path for a lead type, or undefined to use the full catalogue.
 *
 * Accepts either a Sanity title ("Auto Insurance Leads") or a slug
 * ("auto-insurance-leads"), and tolerates a caller passing the bare vertical
 * ("mortgage") by retrying with the `-leads` suffix. Returning undefined is a
 * valid answer, not a failure — `affiliateUrl` then uses `/all-lead-types/`.
 */
export function storeCategoryPath(leadType?: string | null): string | undefined {
  if (!leadType) return undefined;
  const key = leadType.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return STORE_CATEGORY_PATHS[key] ?? STORE_CATEGORY_PATHS[`${key}-leads`];
}

/**
 * "Auto Insurance Leads" → "aged auto insurance leads".
 *
 * Strips the trailing "Leads" before re-adding it, so the label cannot read
 * "aged Mortgage Leads leads" — which is what shipped on ~102 posts until
 * 2026-08-06. Acronyms stay upper-case: "IUL Leads" → "aged IUL leads".
 */
export function agedLeadLabel(leadType?: string | null): string {
  if (!leadType) return "aged leads";
  // `(^|\s+)` not `\s+` — a bare "Leads" must strip to nothing and fall back,
  // otherwise it renders "aged leads leads".
  const stripped = leadType.trim().replace(/[-_]+/g, " ").replace(/(^|\s+)leads$/i, "").trim();
  if (!stripped) return "aged leads";
  const words = stripped
    .split(/\s+/)
    .map((w) => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
  return `aged ${words} leads`;
}

/**
 * Tag an editor-authored link to the partner with this site's UTM parameters.
 *
 * Added 2026-11-16. Sanity post bodies carried 72 hand-pasted links to
 * agedleadstore.com across 74 posts, and 61 of them had no `utm_source` of ours:
 * bare `https://www.agedleadstore.com/`, or parameters copied over from the
 * retired howtoworkleads.com site. Affiliate credit is UTM-based (D16 in
 * lib/utm.ts), so on the partner's side those clicks arrived as untagged and
 * could not be attributed to this site or to the in-body placement.
 *
 * Rules:
 *  - Not the partner's host → returned unchanged.
 *  - `utm_source` and `utm_medium` are always set to ours, overwriting a legacy
 *    or foreign source. A link that carries another site's source is the bug.
 *  - `utm_campaign` and `utm_content` are kept when the editor set them (they
 *    are deliberate, e.g. `blog-70-dials-nobody-answers` / `body-weekly-restock`)
 *    and filled from the arguments when absent.
 *  - Anything unparseable is returned unchanged rather than guessed at.
 */
export function tagAffiliateHref(href: string, campaign: string, content: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return href;
  if (!isAffiliateDomain(url.hostname.toLowerCase())) return href;
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  if (!url.searchParams.get("utm_campaign")) url.searchParams.set("utm_campaign", campaign);
  if (!url.searchParams.get("utm_content")) url.searchParams.set("utm_content", content);
  return url.toString();
}
