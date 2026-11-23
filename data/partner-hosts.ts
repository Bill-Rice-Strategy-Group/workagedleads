// Slim companion to data/providers.ts. Contains only the fields the client
// bundle needs for outbound-click classification (slug, display name, bare
// hostname). Keeping this separate from PROVIDERS avoids shipping the full
// editorial review text (~35KB raw) into every page's client bundle just to
// classify a link.
//
// Source of truth for the *list* is still data/providers.ts. If you add or
// remove a provider there, update this file too. The dev-only assertion in
// data/providers.ts will throw on a build server if they drift.

export interface PartnerHost {
  slug: string;
  name: string;
  /** Bare hostname (no scheme, no www). Matches both the bare host and any subdomain. */
  hostname: string;
}

export const PARTNER_HOSTS: PartnerHost[] = [
  { slug: "aged-lead-store", name: "Aged Lead Store", hostname: "agedleadstore.com" },
  { slug: "the-leads-warehouse", name: "The Leads Warehouse", hostname: "theleadswarehouse.com" },
  { slug: "ileads", name: "iLeads", hostname: "ileads.com" },
  { slug: "need-a-lead", name: "Need-A-Lead", hostname: "needalead.com" },
  { slug: "leadpoint", name: "LeadPoint", hostname: "leadpoint.com" },
  { slug: "badass-insurance-leads", name: "Badass Insurance Leads", hostname: "badassinsuranceleads.com" },
  { slug: "brokers-data", name: "Brokers Data", hostname: "brokersdata.com" },
  { slug: "datatoleads", name: "DataToLeads", hostname: "datatoleads.com" },
  // Retired from PROVIDERS 2026-11-23; kept so old outbound clicks classify.
  { slug: "leadsdata", name: "LeadsData", hostname: "leadsdata.com" },
  { slug: "lead-heroes", name: "Lead Heroes", hostname: "leadheroes.com" },
  { slug: "synergy-direct-solution", name: "Synergy Direct Solution", hostname: "synergydirectsolution.com" },
  { slug: "aged-leads-depot", name: "Aged Leads Depot", hostname: "agedleadsdepot.com" },
  { slug: "lead-tycoons", name: "Lead Tycoons", hostname: "leadtycoons.com" },
  { slug: "quotewizard", name: "QuoteWizard", hostname: "quotewizard.com" },
  { slug: "smartfinancial", name: "SmartFinancial", hostname: "smartfinancial.com" },
];

export function findPartnerByHost(rawHost: string): PartnerHost | undefined {
  const host = rawHost.replace(/^www\./i, "").toLowerCase();
  for (const p of PARTNER_HOSTS) {
    if (host === p.hostname || host.endsWith(`.${p.hostname}`)) return p;
  }
  return undefined;
}
