import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { providersLastVerifiedQuery } from "@/sanity/lib/queries";
import { ProviderCard } from "@/components/provider-card";
import { CtaBanner } from "@/components/cta-banner";
import { HeroAffiliateDoor } from "@/components/hero-affiliate-door";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { PROVIDERS } from "@/data/providers";
import { getVertical } from "@/data/verticals";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  // "aged" is the money term this page ranks for and the old title omitted it.
  title: "Aged Lead Providers: 15+ Rated & Compared",
  description:
    "Independent ratings of 15+ aged lead providers across mortgage, insurance, solar and more. Real pricing, 6-dimension scores, transparent methodology.",
  alternates: { canonical: `${baseUrl}/providers` },
  openGraph: {
    title: "Lead Provider Directory | Work Aged Leads",
    description:
      "Compare lead providers with our independent ratings. 6-dimension scoring, honest editorial reviews, and transparent methodology.",
    url: `${baseUrl}/providers`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Lead Provider Directory")}&category=Lead Marketwatch&type=tool`,
      },
    ],
  },
};

export default async function ProvidersPage() {
  // Static data is the source of truth for editorial content (ratings,
  // descriptions, lead types, pricing, featured status). Sanity contributes
  // only the marketwatch-cron-managed lastVerified date per provider. This
  // matches the data model on /providers/[slug] and avoids drift between the
  // listing and the profile pages.
  const sanityMeta = await sanityFetch(providersLastVerifiedQuery);
  const lastVerifiedBySlug = new Map<string, string>();
  if (sanityMeta) {
    for (const m of sanityMeta) {
      if (m.slug && m.lastVerified) {
        lastVerifiedBySlug.set(m.slug, m.lastVerified);
      }
    }
  }

  const providers = PROVIDERS.map((p) => ({
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    overallRating: p.overallRating,
    lastVerified: lastVerifiedBySlug.get(p.slug) ?? p.lastVerified,
    pricingModel: p.pricingModel,
    leadTypes: p.leadTypes,
    isFeatured: p.isFeatured,
    verticals: p.verticals.map((vSlug) => {
      const vd = getVertical(vSlug);
      return vd
        ? { name: vd.name, slug: vd.slug, icon: vd.icon }
        : { name: vSlug, slug: vSlug, icon: undefined };
    }),
  })).sort((a, b) => b.overallRating - a.overallRating);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lead Provider Directory",
          description:
            "Independent ratings and reviews of lead providers across all major verticals.",
          numberOfItems: providers.length,
          itemListElement: providers.map(
            (p: { name: string; slug: string }, i: number) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${baseUrl}/providers/${p.slug}`,
            })
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
            Lead Marketwatch
          </span>
          {/* H1 + first sentence aligned to "aged leads" (2026-11-18). A
              DataForSEO SERP sample (estimate, 2026-09) shows this page, not the
              homepage, as the site's result for "aged leads"; GSC has the query
              at position 8.9 over the 7 days to 2026-11-18. The definition is the
              same one the homepage uses. */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Aged Lead Providers, Rated
          </h1>
          <p className="speakable-answer mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Aged leads are real consumer inquiries resold after the first
            buyers have had their turn, usually 30 to 365 days after the person
            asked, at a fraction of the price of a real-time lead. These are the
            companies that sell them, with independent ratings across mortgage,
            insurance, solar, and more. Every provider is scored on 6
            dimensions with a transparent, published methodology.
          </p>
          {/* Iteration 4 (2026-09-01). This hub carried 165 views at 0.61% —
              the most-visited page on the site and the worst-converting one.
              Its only affiliate path was a single CtaBanner at the very bottom,
              below fifteen provider cards that each link out to a competitor,
              so a reader at peak intent was offered every destination except
              the one that pays.

              The precedent is the lead-types hub directly: 159 views at 1.26%
              before this same door, 5.31% after (see lead-types/page.tsx:112).

              No leadType — a visitor on a directory has not chosen a vertical,
              so the full catalogue is the honest destination. The three
              internal routes keep their position as secondary; they are how
              this page earns the trust that makes the door work at all, and
              the individual reviews stay untouched. */}
          <HeroAffiliateDoor
            campaign="providers-hub"
            secondary={[
              { label: "Head-to-head comparisons", href: "/compare" },
              { label: "Lead Price Index", href: "/price-index" },
              { label: "Our Methodology", href: "/methodology" },
            ]}
          />
        </div>
      </section>

      {/* Provider Grid */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              All Providers
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {providers.length} providers rated &middot; Sorted by overall score
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map(
              (p) => (
                <ProviderCard
                  key={p.slug}
                  name={p.name}
                  slug={p.slug}
                  shortDescription={p.shortDescription}
                  overallRating={p.overallRating}
                  lastVerified={p.lastVerified}
                  pricingModel={p.pricingModel}
                  leadTypes={p.leadTypes}
                  verticals={p.verticals}
                  isFeatured={p.isFeatured}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Rating Methodology Summary */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              How We Rate Providers
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Every provider is independently evaluated across six weighted
              dimensions. We publish our methodology, date every review, and
              include honest assessments — including what each provider is{" "}
              <em>not</em> ideal for. Affiliate relationships never affect our
              ratings.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Pricing Transparency",
                weight: "20%",
                desc: "Published prices, self-service purchasing",
              },
              {
                label: "Value",
                weight: "20%",
                desc: "Price relative to quality and contact rates",
              },
              {
                label: "Data Quality & Compliance",
                weight: "20%",
                desc: "Verified data, DNC scrubbing, TCPA paperwork handoff",
              },
              {
                label: "Flexibility",
                weight: "15%",
                desc: "Minimums, contracts, return policies",
              },
              {
                label: "Platform & Delivery",
                weight: "15%",
                desc: "Self-service portal, API, CRM integration",
              },
              {
                label: "Reputation",
                weight: "10%",
                desc: "Years in business, BBB rating, industry presence",
              },
            ].map((dim) => (
              <div
                key={dim.label}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {dim.label}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {dim.weight}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {dim.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-zinc-500 dark:text-zinc-400">
            Data Quality &amp; Compliance scores what providers actually deliver
            to buyers: verified contact data, DNC scrubbing, and TCPA paperwork
            handoff. All purchased lead inventory is brokered consumer data —
            fresh consent before outreach is the buyer&apos;s responsibility.
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/methodology"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Read our full methodology &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
