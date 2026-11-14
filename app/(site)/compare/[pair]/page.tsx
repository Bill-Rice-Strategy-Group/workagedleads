import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ComparisonTable } from "@/components/comparison-table";
import { CtaBanner } from "@/components/cta-banner";
import { HeroAffiliateDoor } from "@/components/hero-affiliate-door";
import { CiteThisButton } from "@/components/cite-this-button";
import {
  JsonLd,
  breadcrumbJsonLd,
  speakableWebPageJsonLd,
} from "@/components/json-ld";
import { getProvider, getProviderPairs } from "@/data/providers";

/**
 * The slug of the one provider in this directory we are paid by. Every other
 * outbound host on the site earns nothing (`isAffiliateDomain` in
 * `lib/affiliate.ts`), which is what makes the disclosure on this page accurate
 * rather than boilerplate.
 */
const PARTNER_SLUG = "aged-lead-store";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf("-vs-");
  if (idx === -1) return null;
  const a = pair.slice(0, idx);
  const b = pair.slice(idx + 4);
  if (!a || !b) return null;
  // Canonical order: alphabetical
  return a < b ? [a, b] : [b, a];
}

export function generateStaticParams() {
  return getProviderPairs().map(([a, b]) => ({
    pair: `${a}-vs-${b}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};

  const [slugA, slugB] = parsed;
  const pA = getProvider(slugA);
  const pB = getProvider(slugB);
  if (!pA || !pB) return {};

  // Keep the boilerplate short — the provider names already carry the keywords,
  // and long pairs (e.g. "Aged Lead Store vs Synergy Direct Solution") blew the
  // ~60-char SERP budget with the old "— Lead Provider Comparison" suffix.
  const title = `${pA.name} vs ${pB.name} — Compared`;
  // Only the 14 pairings involving Aged Lead Store carry meaningful commercial
  // search intent; the other 91 are programmatic filler that dilutes topical
  // authority. Noindex them but keep follow=true so internal links still pass
  // equity. Reversible — flip the rule any time.
  const involvesAls = slugA === PARTNER_SLUG || slugB === PARTNER_SLUG;
  return {
    title,
    description: `Side-by-side comparison of ${pA.name} (${pA.overallRating}/10) vs ${pB.name} (${pB.overallRating}/10). Ratings, features, pricing models, and which is right for you.`,
    alternates: { canonical: `${baseUrl}/compare/${slugA}-vs-${slugB}` },
    robots: involvesAls ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${pA.name} vs ${pB.name} | Work Aged Leads`,
      description: `Head-to-head comparison across 6 dimensions: pricing transparency, value, compliance, flexibility, platform, and reputation.`,
      url: `${baseUrl}/compare/${slugA}-vs-${slugB}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${pA.name} vs ${pB.name}`)}&category=Comparison&type=tool`,
        },
      ],
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return notFound();

  const [slugA, slugB] = parsed;
  const providerA = getProvider(slugA);
  const providerB = getProvider(slugB);

  if (!providerA || !providerB) return notFound();

  // Determine recommendation
  const diff = providerA.overallRating - providerB.overallRating;

  /*
    AN OUTBOUND DOOR ON THE 14 PAIRS THAT INCLUDE THE PARTNER (2026-10-05)

    `generateStaticParams` emits all 105 combinatorial pairs, but only the 14
    that feature Aged Lead Store carry a destination we are paid for; the other
    91 are already noindexed as programmatic filler. Until now every one of the
    14 carried exactly one affiliate surface — the sitewide `CtaBanner` at the
    very bottom — which is the same shape `/providers` had at 0.61% before
    iteration 4 took it to 3.68% by putting a door where the decision happens.

    Placed AFTER the recommendation, not in the hero. The reader's reason for
    being here is the head-to-head; a door above the table would be selling
    before the comparison that earns the click. Nothing is removed or demoted to
    make room — both "Full Review" links, the ratings table and the methodology
    link are untouched, and the competitor's review sits directly beside this
    door as the secondary action.

    NO VERTICAL IS DECLARED ON A PAIR PAGE. Two providers can overlap on several
    verticals or on none, and there is nothing on the page that says which one
    the reader came for. So this resolves no segment and lands on the full
    catalogue — the honest answer, and not a weak one: the catalogue card grid is
    exactly where `providers-hub / hero-door` sends its traffic, and that is the
    door earning the money (22 sessions, 15 add-to-carts, 5 orders, $545.00 over
    2026-09-01 -> 10-05). Picking a vertical for the reader would be a guess
    dressed as a recommendation.
  */
  const partner =
    providerA.slug === PARTNER_SLUG
      ? providerA
      : providerB.slug === PARTNER_SLUG
        ? providerB
        : undefined;
  const alternative = partner
    ? partner.slug === providerA.slug
      ? providerB
      : providerA
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
          {
            name: `${providerA.name} vs ${providerB.name}`,
            url: `${baseUrl}/compare/${slugA}-vs-${slugB}`,
          },
        ])}
      />
      <JsonLd
        data={speakableWebPageJsonLd({
          name: `${providerA.name} vs ${providerB.name}`,
          url: `${baseUrl}/compare/${slugA}-vs-${slugB}`,
          cssSelector: [".speakable-answer"],
        })}
      />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/providers"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Providers
              </Link>
              <span>/</span>
              <span>Compare</span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              {providerA.name} vs {providerB.name}
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Head-to-head comparison across 6 independently scored dimensions.
              All ratings based on our{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                published methodology
              </Link>
              .
            </p>
          </div>

          <ComparisonTable providerA={providerA} providerB={providerB} />

          {/* Recommendation */}
          <div className="speakable-answer mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Our Recommendation
            </h3>
            <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                <strong className="text-zinc-900 dark:text-white">
                  Choose {providerA.name} if:
                </strong>{" "}
                {providerA.bestFor.slice(0, 3).join(", ").toLowerCase()} is what
                you need.
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-white">
                  Choose {providerB.name} if:
                </strong>{" "}
                {providerB.bestFor.slice(0, 3).join(", ").toLowerCase()} is what
                you need.
              </p>
              {Math.abs(diff) >= 1 && (
                <p className="font-medium text-zinc-900 dark:text-white">
                  Overall,{" "}
                  {diff > 0 ? providerA.name : providerB.name} scores
                  higher at{" "}
                  {Math.max(
                    providerA.overallRating,
                    providerB.overallRating
                  ).toFixed(1)}
                  /10 vs{" "}
                  {Math.min(
                    providerA.overallRating,
                    providerB.overallRating
                  ).toFixed(1)}
                  /10 — but the best choice depends on your specific needs and
                  vertical.
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/providers/${providerA.slug}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Full {providerA.name} Review
              </Link>
              <Link
                href={`/providers/${providerB.slug}`}
                className="inline-flex items-center rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Full {providerB.name} Review
              </Link>
            </div>
          </div>

          {partner && alternative && (
            <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Buy aged leads from {partner.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                {partner.name} is the one provider in this comparison we have an
                affiliate relationship with, and we say so here rather than only
                in the footer. Their catalog is self-serve with published
                per-lead pricing, so you can check what your vertical and state
                actually cost before you commit to anything.{" "}
                {alternative.pricingModel === "transparent"
                  ? `${alternative.name} publishes pricing too — compare both before you buy.`
                  : `${alternative.name} quotes through a salesperson, so you will need to contact them for a number to compare against.`}
              </p>
              <HeroAffiliateDoor
                campaign="compare-pair"
                content="compare-door"
                tone="light"
                secondary={[
                  // The alternative stays directly beside the paid door, not
                  // only above it. Worded differently from the "Full ... Review"
                  // button in the recommendation block so the two reads do not
                  // look like the same link repeated.
                  // "See X instead" rather than "Read our X review": provider
                  // names that start with an article ("The Leads Warehouse")
                  // make a possessive label read as "Read our The Leads
                  // Warehouse review".
                  {
                    label: `See ${alternative.name} instead`,
                    href: `/providers/${alternative.slug}`,
                  },
                ]}
              />
            </div>
          )}

          {/* Disclosure */}
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              <strong>Disclosure:</strong> We may earn a commission if you
              purchase through our links. This does not affect our ratings.{" "}
              <Link
                href="/methodology"
                className="text-blue-600 dark:text-blue-400"
              >
                Read our methodology
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">Reference this comparison:</span>
            <CiteThisButton
              citation={`${providerA.name} vs ${providerB.name} comparison from Work Aged Leads independent provider directory. Source: ${baseUrl}/compare/${pair}`}
            />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
