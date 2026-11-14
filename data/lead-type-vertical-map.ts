/**
 * Single source of truth for the lead-type ↔ vertical relationship.
 *
 * Lead-type page slugs (e.g. "mva-leads", "iul-leads") don't always match
 * vertical slugs (e.g. "legal", "annuity-iul"), and the relationship is not
 * 1:1 — several insurance lead types map onto the same family of verticals. We
 * keep BOTH directions curated by hand (rather than deriving the reverse from
 * the forward map) so the internal-linking cluster never produces a mislink.
 *
 * This powers the cluster that ties each vertical together for SEO:
 *   lead-type guide  ↔  price index  ↔  best providers
 */

/** Lead-type page slug → its vertical slug (for price-index + providers/best). */
export const LEAD_TYPE_TO_VERTICAL: Record<string, string> = {
  "mortgage-leads": "mortgage",
  // The generic insurance bucket. Points at life-insurance (the largest
  // insurance vertical) rather than auto-insurance, which now has its own
  // dedicated guide and should keep its own cluster links.
  "insurance-leads": "life-insurance",
  "final-expense-leads": "final-expense",
  "iul-leads": "annuity-iul",
  // SSDI = Social Security Disability; these are disability-attorney leads, so
  // they map to the "legal" vertical (same as mva-leads), NOT life-insurance.
  "ssdi-leads": "legal",
  "mva-leads": "legal",
  // The umbrella guide for the legal vertical — bankruptcy, family law and
  // workers' comp had no lead type at all before this, so their posts fell back
  // to the generic catalogue CTA.
  "legal-leads": "legal",
  "solar-leads": "solar",
  "medicare-leads": "medicare",
  // Added for the workagedleads.com consolidation so leadType covers the same
  // vertical spine as /price-index/* and /providers/best/*, giving every folded
  // /buying-leads page a topic-matched destination.
  "life-insurance-leads": "life-insurance",
  "auto-insurance-leads": "auto-insurance",
  "health-insurance-leads": "health-insurance",
  "home-improvement-leads": "home-improvement",
  // Legacy slug. The page 301s to home-improvement-leads in next.config.ts, so
  // nothing should reach the lead-type route under this slug — but the slug
  // still appears in older content and in the url-map, and any other caller of
  // verticalForLeadType would otherwise fall back to "home-services", which is
  // not a real vertical. Keep the mapping.
  "home-services-leads": "home-improvement",
  // Added 2026-10-05 with the annuity guide. REQUIRED, not cosmetic: without it
  // `verticalForLeadType` strips the suffix to "annuity", which is not a slug in
  // VERTICALS, so the guide's hero would render secondary links to
  // /providers/best/annuity and /price-index/annuity — two routes that do not
  // exist. "annuity-iul" is the vertical that covers it, and it is also where
  // the adjacent IUL cluster already converts.
  "annuity-leads": "annuity-iul",
  // The suffix-strip fallback would resolve "homeowners-insurance" correctly on
  // its own, since that IS a real vertical. Stated explicitly anyway so the
  // relationship is curated rather than accidental, matching every other entry.
  "homeowners-insurance-leads": "homeowners-insurance",
};

export function verticalForLeadType(leadTypeSlug: string): string {
  return (
    LEAD_TYPE_TO_VERTICAL[leadTypeSlug] || leadTypeSlug.replace(/-leads$/, "")
  );
}

/**
 * Vertical slug → its primary lead-type guide slug. Curated (NOT derived from
 * the forward map) because several lead types point at the same vertical and we
 * want the most relevant guide for each vertical, not whichever happened to be
 * listed first. Only verticals that have a dedicated guide appear here.
 */
export const VERTICAL_TO_LEAD_TYPE: Record<string, string> = {
  mortgage: "mortgage-leads",
  // These four used to funnel into the generic "insurance-leads" guide (and,
  // for home-improvement, into "home-services-leads" — a page that no longer
  // exists, so the cluster link was dead). Each now has a dedicated guide.
  "auto-insurance": "auto-insurance-leads",
  "life-insurance": "life-insurance-leads",
  "health-insurance": "health-insurance-leads",
  "home-improvement": "home-improvement-leads",
  "final-expense": "final-expense-leads",
  "annuity-iul": "iul-leads",
  // The umbrella guide, not mva-leads: /price-index/legal and
  // /providers/best/legal cover the whole vertical (bankruptcy, family law,
  // workers' comp, injury, disability), so the category hub is the honest
  // destination. MVA keeps its own guide and its own head term.
  legal: "legal-leads",
  solar: "solar-leads",
  medicare: "medicare-leads",
  // Added 2026-10-05: the homeowners-insurance vertical had no guide at all, so
  // /price-index/homeowners-insurance and /providers/best/homeowners-insurance
  // rendered no cluster link. Deliberately NOT adding annuity-iul -> annuity-leads
  // in this direction: that vertical's established guide is iul-leads and it owns
  // the head term, so reassigning it would take the cluster link off a page that
  // already converts and give it to a brand-new one.
  "homeowners-insurance": "homeowners-insurance-leads",
};

export function leadTypeForVertical(
  verticalSlug: string
): string | undefined {
  return VERTICAL_TO_LEAD_TYPE[verticalSlug];
}

/**
 * Lead-type guide → sibling guides worth a contextual link. Curated by hand,
 * same as the maps above, so a guide only links to neighbours a reader of that
 * vertical would plausibly buy next.
 *
 * Added 2026-11-14. Before this the only links between lead-type guides were
 * the footer and the /lead-types hub, so the insurance family (insurance,
 * life, IUL, final expense, annuity) never linked to each other in body
 * content. `/lead-types/life-insurance-leads` — the largest impression base on
 * the site, still deep on page 3+ — gets a contextual link from five siblings.
 */
export const RELATED_LEAD_TYPES: Record<string, string[]> = {
  "insurance-leads": [
    "life-insurance-leads",
    "auto-insurance-leads",
    "health-insurance-leads",
    "homeowners-insurance-leads",
  ],
  "life-insurance-leads": [
    "iul-leads",
    "final-expense-leads",
    "annuity-leads",
    "insurance-leads",
  ],
  "iul-leads": ["life-insurance-leads", "annuity-leads", "final-expense-leads"],
  "final-expense-leads": ["life-insurance-leads", "iul-leads", "medicare-leads"],
  "annuity-leads": ["iul-leads", "life-insurance-leads"],
  "auto-insurance-leads": ["insurance-leads", "homeowners-insurance-leads"],
  "homeowners-insurance-leads": [
    "insurance-leads",
    "auto-insurance-leads",
    "mortgage-leads",
  ],
  "health-insurance-leads": ["insurance-leads", "medicare-leads", "life-insurance-leads"],
  "medicare-leads": ["health-insurance-leads", "final-expense-leads"],
  "legal-leads": ["mva-leads", "ssdi-leads"],
  "mva-leads": ["legal-leads", "ssdi-leads"],
  "ssdi-leads": ["legal-leads", "mva-leads"],
};
