import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  providerBySlugQuery,
  allProviderSlugsQuery,
} from "@/sanity/lib/queries";
import { ProviderRatingBadge } from "@/components/provider-rating-badge";
import { ProviderRatingBar } from "@/components/provider-rating-bar";
import { ProviderRatingRadar } from "@/components/provider-rating-radar";
import { FreshnessIndicator } from "@/components/freshness-indicator";
import { CtaBanner } from "@/components/cta-banner";
import { RelatedLinks } from "@/components/related-links";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getProvider, PROVIDERS } from "@/data/providers";
import { getVertical } from "@/data/verticals";
import { leadTypeForVertical } from "@/data/lead-type-vertical-map";
import { ProviderCompareSelector } from "@/components/provider-compare-selector";
import { ProviderStoreAlternative } from "@/components/provider-store-alternative";
import { TrackedOutboundLink } from "@/components/tracked-outbound-link";
import { providerWebsiteUrl, isAffiliateProvider } from "@/lib/provider-links";
import { affiliateUrl } from "@/lib/affiliate";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

const LEAD_TYPE_LABELS: Record<string, string> = {
  aged: "Aged Internet Leads",
  "real-time": "Real-Time Internet Leads",
  "live-transfer": "Live Transfers",
  trigger: "Trigger / Credit Pulls",
  "data-list": "Data Lists",
  "direct-mail": "Direct Mail Leads",
};

const PRICING_LABELS: Record<string, string> = {
  transparent: "Transparent — prices published online",
  "semi-transparent": "Semi-Transparent — ranges published, exact quotes require contact",
  "sales-required": "Sales Required — must contact for pricing",
};

const DELIVERY_LABELS: Record<string, string> = {
  "instant-download": "Instant Download / CSV",
  email: "Email Delivery",
  api: "API Integration",
  "crm-push": "CRM Push",
  "real-time-post": "Real-Time Post",
};

const COMPLIANCE_LABELS: Record<string, string> = {
  "tcpa-docs": "TCPA Documentation Handoff",
  "dnc-scrubbing": "DNC Scrubbing",
};

export async function generateStaticParams() {
  const sanityResult = await sanityFetch(allProviderSlugsQuery);
  if (sanityResult && sanityResult.length > 0) {
    return sanityResult.map((p: { slug: string }) => ({ slug: p.slug }));
  }
  return PROVIDERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const staticProvider = getProvider(slug);
  const name = staticProvider?.name || slug;

  // When a provider has a dedicated in-depth blog review, this profile defers
  // to that article for "{name} review" search intent — it retargets to a
  // directory framing and canonicalizes to the article so the two pages stop
  // competing for the same branded query.
  const reviewSlug = staticProvider?.reviewArticleSlug;

  if (reviewSlug) {
    // A provider with a searchAlias (e.g. "AgedLeadStore") leads with the way
    // people search for it, so the profile matches the brand query it ranks for.
    const alias = staticProvider?.searchAlias;
    return {
      title: alias
        ? `${alias} (${name}): Pricing, Ratings & Profile`
        : `${name}: Pricing, Ratings & Provider Profile`,
      // Kept short enough that even a long provider name stays inside the
      // ~160 characters Google renders — this interpolates the name twice at
      // 177 characters for "Aged Lead Store" alone.
      description: alias
        ? `What ${alias} is, how its aged leads are priced and sold, and how it scores on our six dimensions. Profile of ${staticProvider?.website.replace(/^https?:\/\//, "")}.`
        : `${name} provider profile: pricing model, lead types, compliance, and our 6-dimension ratings, with a link to the full review.`,
      alternates: { canonical: `${baseUrl}/blog/${reviewSlug}` },
      openGraph: {
        title: `${name} — Provider Profile | Work Aged Leads`,
        description: `${name} at a glance: pricing model, lead types, compliance, and transparent 6-dimension ratings.`,
        url: `${baseUrl}/providers/${slug}`,
        images: [
          {
            url: `${baseUrl}/api/og?title=${encodeURIComponent(`${name} — Provider Profile`)}&category=Provider Profile&type=tool`,
          },
        ],
      },
    };
  }

  // "{brand} leads" is the AGENT query; "{brand} reviews" is largely a CONSUMER
  // one. Checked on the live SERPs 2026-09-30: "quotewizard reviews" (450/mo) is
  // owned by Trustpilot, the BBB, ConsumerAffairs and r/Insurance — people asking
  // whether the quote site is safe. "quotewizard leads" (200/mo, KD 1) is agents,
  // and the pages above us there are small review sites at DR 35 and DR 18.
  // Naming the lead product is what puts these pages in the right search.
  // Substring, not word-boundary: "iLeads" and "DataToLeads" carry the word
  // mid-name, and a \b check produced "iLeads Leads Review".
  const searchName = /lead/i.test(name) ? name : `${name} Leads`;

  return {
    title: `${searchName} Review: Pricing & Verdict`,
    description: `Independent review of ${searchName} for agents: pricing, lead types, compliance, and our 6-dimension ratings against other providers.`,
    alternates: { canonical: `${baseUrl}/providers/${slug}` },
    openGraph: {
      title: `${searchName} Review | Work Aged Leads`,
      description: `Independent ${name} review with transparent ratings across pricing, value, compliance, flexibility, platform, and reputation.`,
      url: `${baseUrl}/providers/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${name} Review`)}&category=Provider Rating&type=tool`,
        },
      ],
    },
  };
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try Sanity first, fall back to static data
  const sanityProvider = (await sanityFetch(providerBySlugQuery, { slug })) as
    | { lastVerified?: string; lastScanned?: string }
    | null;
  const staticProvider = getProvider(slug);

  if (!sanityProvider && !staticProvider) return notFound();

  // Static data carries the editorial review. Sanity's lastVerified is now a
  // HUMAN field too — the marketwatch cron stamps lastScanned instead, as of
  // 2026-10-07 — so preferring it is safe: it means an editor updated the
  // profile in Studio more recently than the static file was touched.
  const p = {
    ...staticProvider!,
    lastVerified: sanityProvider?.lastVerified || staticProvider!.lastVerified,
    lastScanned: sanityProvider?.lastScanned,
  };

  const ratings = [
    { label: "Pricing Transparency", score: p.ratingTransparency, weight: "20%" },
    { label: "Value", score: p.ratingValue, weight: "20%" },
    { label: "Data Quality & Compliance", score: p.ratingCompliance, weight: "20%" },
    { label: "Flexibility", score: p.ratingFlexibility, weight: "15%" },
    { label: "Platform & Delivery", score: p.ratingPlatform, weight: "15%" },
    { label: "Reputation & Track Record", score: p.ratingReputation, weight: "10%" },
  ];

  // Internal-linking cluster: from this provider profile (our best-ranking
  // page type) funnel equity to the high-demand lead-type guides and
  // best-in-vertical pages for the verticals this provider actually serves.
  const servedWithGuide = (p.verticals || [])
    .filter((v) => leadTypeForVertical(v))
    .slice(0, 4);
  const relatedLinks = [
    ...servedWithGuide.map((v) => {
      const vname = getVertical(v)?.name || v;
      return {
        href: `/lead-types/${leadTypeForVertical(v)}`,
        label: `Aged ${vname.toLowerCase()} leads`,
        description: `Buyer's guide: pricing, sourcing, and how to work ${vname.toLowerCase()} leads.`,
      };
    }),
    servedWithGuide[0]
      ? {
          href: `/providers/best/${servedWithGuide[0]}`,
          label: `Best ${(
            getVertical(servedWithGuide[0])?.name || servedWithGuide[0]
          ).toLowerCase()} providers`,
          description: `See how ${p.name} ranks against competitors.`,
        }
      : null,
    // Crawlable link into the comparison cluster. ProviderCompareSelector above
    // is a <select> + router.push(), so it emits no <a href> — which left all 17
    // indexed /compare/* pages with zero inbound links from anywhere on the
    // site, reachable only via the sitemap, despite being the best-converting
    // format we publish.
    p.slug !== "aged-lead-store"
      ? {
          href: `/compare/${["aged-lead-store", p.slug].sort().join("-vs-")}`,
          label: `${p.name} vs Aged Lead Store`,
          description: `Head-to-head against the largest aged lead marketplace, scored on the same six dimensions.`,
        }
      : {
          href: "/compare",
          label: "All provider comparisons",
          description: `Every head-to-head we publish, plus the lead-type decisions that follow.`,
        },
    {
      href: "/price-index",
      label: "Lead Price Index",
      description: "Quarterly verified pricing benchmarks across every vertical.",
    },
  ];

  // Short axis labels for the radar (the bar list keeps the full names).
  const radarDimensions = [
    { label: "Transparency", score: p.ratingTransparency },
    { label: "Value", score: p.ratingValue },
    { label: "Compliance", score: p.ratingCompliance },
    { label: "Flexibility", score: p.ratingFlexibility },
    { label: "Platform", score: p.ratingPlatform },
    { label: "Reputation", score: p.ratingReputation },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
          { name: p.name, url: `${baseUrl}/providers/${p.slug}` },
        ])}
      />
      {/* Provider identity (no rating here — the rating lives on the Product
          Review below so it isn't a duplicate/conflicting signal). */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: p.name,
          url: p.website,
          foundingDate: String(p.foundedYear),
        }}
      />
      {/* Product + editorial Review carrying our star rating. This is a
          third-party (non-self-serving) review of another company's offering,
          which is the structure eligible for review-snippet stars — unlike an
          AggregateRating on the Organization itself.

          When a dedicated blog review exists, that article owns the Review
          schema and this profile canonicalizes to it, so emitting the rating
          here too would duplicate the signal for the same entity. */}
      {!p.reviewArticleSlug && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${p.name} Aged Leads`,
            brand: { "@type": "Brand", name: p.name },
            description: p.shortDescription,
            review: {
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: p.overallRating,
                bestRating: 10,
                worstRating: 1,
              },
              author: {
                "@type": "Organization",
                name: "Work Aged Leads",
                url: baseUrl,
              },
              datePublished: p.lastVerified,
              reviewBody: p.ratingNotes || p.shortDescription,
            },
          }}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: "Providers", href: "/providers" },
              { label: p.name },
            ]}
          />
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {p.name}
                {p.searchAlias && (
                  <span className="text-zinc-400"> ({p.searchAlias})</span>
                )}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {p.foundedYear && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                    Est. {p.foundedYear}
                  </span>
                )}
                {p.bbbRating && p.bbbRating !== "NR" && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                    BBB: {p.bbbRating}
                  </span>
                )}
                {p.headquartersState && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                    {p.headquartersState}
                  </span>
                )}
                <FreshnessIndicator lastVerified={p.lastVerified} lastScanned={p.lastScanned} />
              </div>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
                {p.shortDescription}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {p.website && (
                  <TrackedOutboundLink
                    href={providerWebsiteUrl(p.website, {
                      campaign: `provider-${p.slug}`,
                      content: "visit-website-hero",
                    })}
                    ctaId={`visit-${p.slug}`}
                    ctaLocation="provider-profile-hero"
                    isAffiliate={isAffiliateProvider(p.slug)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    Visit Website
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  </TrackedOutboundLink>
                )}
                <ProviderCompareSelector
                  currentSlug={p.slug}
                  providers={PROVIDERS.map((prov) => ({
                    name: prov.name,
                    slug: prov.slug,
                  }))}
                />
              </div>
              {/* The alternative, at the same decision point as the outbound
                  link above — which keeps its primary styling and its position.
                  Every non-affiliate outbound click the site recorded in the 30
                  days to 2026-10-05 left from this button (42 of 202, all
                  carrying utm_campaign=provider-{slug}), on pages that offered
                  the reader no comparison until six screens down. Renders
                  nothing on the partner's own profile. See the component. */}
              <ProviderStoreAlternative
                providerSlug={p.slug}
                providerName={p.name}
                providerRating={p.overallRating}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <ProviderRatingBadge score={p.overallRating} size="lg" />
              <span className="text-xs font-medium text-zinc-400">
                Overall Score
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Direct answer to "what is {brand}" — only for providers that carry
          one (the affiliate partner, whose one-word brand query this page
          ranks for). Facts come from the provider record; the link is the
          standard tagged affiliate URL from lib/affiliate.ts. */}
      {p.directAnswer && (
        <section className="bg-white py-10 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                What is {p.searchAlias ?? p.name}?
              </h2>
              <p className="mt-4 text-zinc-700 dark:text-zinc-300">
                {p.directAnswer}
              </p>
              {isAffiliateProvider(p.slug) && (
                <p className="mt-4 text-sm">
                  <TrackedOutboundLink
                    href={affiliateUrl({
                      campaign: `provider-${p.slug}`,
                      content: "what-is-answer",
                    })}
                    ctaId={`what-is-${p.slug}`}
                    ctaLocation="provider-profile-what-is"
                    isAffiliate
                    className="font-semibold text-blue-700 underline hover:text-blue-800 dark:text-blue-400"
                  >
                    Browse lead types and prices on agedleadstore.com
                  </TrackedOutboundLink>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Take */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Our Take
            </h2>
            {p.reviewArticleSlug && (
              <Link
                href={`/blog/${p.reviewArticleSlug}`}
                className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:hover:bg-blue-950/70"
              >
                <span className="text-sm text-blue-900 dark:text-blue-200">
                  This is a quick profile. Read our full in-depth{" "}
                  <strong>{p.name} review</strong> — pricing tables, vertical
                  breakdowns, weaknesses, and who it&rsquo;s actually right for.
                </span>
                <span className="shrink-0 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Read review &rarr;
                </span>
              </Link>
            )}
            <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
              {p.editorialReview.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Best For
                </h3>
                <ul className="mt-2 space-y-1">
                  {p.bestFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                      <span className="mt-0.5">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Not Ideal For
                </h3>
                <ul className="mt-2 space-y-1">
                  {p.notIdealFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <span className="mt-0.5">&#10007;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings Breakdown */}
      <section className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Ratings Breakdown
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Scored 1-10 across six weighted dimensions.{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                See methodology
              </Link>
            </p>
            <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
              <ProviderRatingRadar
                dimensions={radarDimensions}
                providerName={p.name}
              />
              <div className="space-y-4">
                {ratings.map((r) => (
                  <ProviderRatingBar
                    key={r.label}
                    label={r.label}
                    score={r.score}
                    weight={r.weight}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What They Offer */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              What They Offer
            </h2>
            <div className="mt-6 space-y-6">
              {/* Lead Types */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Lead Types
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.leadTypes.map((lt) => (
                    <span
                      key={lt}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {LEAD_TYPE_LABELS[lt] || lt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operations Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Pricing Model
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {PRICING_LABELS[p.pricingModel] || p.pricingModel}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Minimums
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.hasMinimums
                      ? p.minimumDescription || "Yes — contact for details"
                      : "No minimums"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Contract Required
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.contractRequired ? "Yes" : "No contract required"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Return / Refund Policy
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.returnPolicy}
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Delivery Methods
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.deliveryMethods.map((dm) => (
                    <span
                      key={dm}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {DELIVERY_LABELS[dm] || dm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Compliance Features
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.complianceFeatures.map((cf) => (
                    <span
                      key={cf}
                      className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    >
                      &#10003; {COMPLIANCE_LABELS[cf] || cf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        title={`Explore ${p.name}'s verticals`}
        intro="Buyer's guides, pricing, and provider comparisons for the lead types this provider serves."
        links={relatedLinks}
      />

      {/* Disclosure */}
      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <strong>Disclosure:</strong> We may earn a commission if you
            purchase through our links. This does not affect our ratings or
            editorial content. Providers cannot pay for higher scores.{" "}
            <Link
              href="/methodology"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Read our methodology
            </Link>
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
