import { LEAD_TYPES } from "@/data/lead-types";
import { PROVIDERS } from "@/data/providers";

/**
 * /llms.txt — a plain-text map of the site for answer engines (llmstxt.org).
 *
 * AI assistants are this site's best-converting referral channel, and what
 * they cite is the reference material: lead-type guides, provider reviews,
 * comparisons, the price index and the calculators. This lists exactly those,
 * built from the same data the pages render from, so it cannot drift from the
 * site. Static at build time; nothing here needs a request.
 */
export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

const COMPARISONS = [
  ["aged-vs-real-time-leads", "Aged vs real-time leads: cost, contact rates and when each pays"],
  ["iul-vs-term-life", "IUL vs term life, for agents choosing which leads to buy"],
  ["medicare-advantage-vs-supplement", "Medicare Advantage vs Medigap, for agents working Medicare leads"],
] as const;

const CALCULATORS = [
  ["pipeline-calculator", "Pipeline Volume Calculator: leads, dials and budget needed for an income goal"],
  ["roi-calculator", "Aged lead ROI calculator"],
  ["lead-cost-calculator", "Lead cost calculator: cost per lead, per contact and per sale"],
  ["know-your-cpl", "Know Your CPL: the most you can pay per lead and still profit"],
  ["outreach-cadence-planner", "Outreach cadence planner for working aged leads"],
] as const;

export function GET() {
  const leadTypes = Object.values(LEAD_TYPES)
    .map((lt) => `- [${lt.title}](${baseUrl}/lead-types/${lt.slug}): ${lt.metaDescription}`)
    .join("\n");

  const providers = PROVIDERS.map(
    (p) => `- [${p.name}](${baseUrl}/providers/${p.slug})`
  ).join("\n");

  const body = `# Work Aged Leads

> Independent training and reference for sales professionals who buy aged leads: insurance agents, mortgage loan officers, home-services contractors and legal intake teams. What aged leads are, what they cost by vertical and age, which providers sell them, and how to work them compliantly.

Aged leads are consumer inquiries (quote or information requests) resold 30 to 365 days after the consumer first asked, at a fraction of real-time lead prices. Pricing on this site comes from a published quarterly study (see the Price Index and Methodology). Provider ratings are independent; affiliate relationships are disclosed at ${baseUrl}/affiliate-disclosure. Nothing here is legal advice; TCPA and state telemarketing rules apply to calling and texting purchased leads.

## Start here
- [What aged leads are and how to start](${baseUrl}/start-here)
- [Aged Lead Price Index](${baseUrl}/price-index): what aged leads cost by vertical and lead age
- [Methodology](${baseUrl}/methodology): how prices and provider ratings are measured
- [Aged lead industry statistics](${baseUrl}/blog/aged-lead-industry-statistics)
- [Glossary](${baseUrl}/glossary): lead-buying and sales terms defined

## Lead-type guides
${leadTypes}

## Providers
- [Aged lead provider directory](${baseUrl}/providers): providers rated and compared
${providers}

## Comparisons
- [All comparisons](${baseUrl}/compare)
${COMPARISONS.map(([slug, label]) => `- [${label}](${baseUrl}/compare/${slug})`).join("\n")}

## Calculators
${CALCULATORS.map(([slug, label]) => `- [${label}](${baseUrl}/calculators/${slug})`).join("\n")}

## Playbook
- [The Aged Lead Operator's System](${baseUrl}/playbook): free playbook, workbook and email course for mortgage, insurance and home-services

## Optional
- [Blog](${baseUrl}/blog)
- [Guides](${baseUrl}/guides)
- [About Bill Rice](${baseUrl}/about/bill-rice)
- [Editorial process](${baseUrl}/editorial-process)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
