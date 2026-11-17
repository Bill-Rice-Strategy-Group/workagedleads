import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PriceBenchmarkTable } from "@/components/price-benchmark-table";
import { PriceTrendChart, type PriceTrendPoint } from "@/components/price-trend-chart";
import { PriceDisclosurePanel } from "@/components/price-disclosure-panel";
import { CtaBanner } from "@/components/cta-banner";
import { RelatedLinks } from "@/components/related-links";
import { CiteThisButton } from "@/components/cite-this-button";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { VERTICALS, getVertical } from "@/data/verticals";
import { leadTypeForVertical } from "@/data/lead-type-vertical-map";
import {
  quarterLabel,
  EXCLUSIVITY_LABELS,
  LEAD_TYPE_LABELS,
  type PriceBenchmarkData,
} from "@/data/price-benchmarks";
import {
  fillBenchmarkGaps,
  getDecayProfile,
  getDecayLabel,
} from "@/lib/pricing-model";
import {
  loadTrustworthyBenchmarks,
  hasTrustworthyBenchmarks,
} from "@/lib/benchmark-coverage";
import {
  selectTrendSeries,
  TREND_CHART_MIN_MONTHS,
} from "@/lib/price-trend-series";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: verticalSlug } = await params;
  const vertical = getVertical(verticalSlug);
  if (!vertical) return {};

  const title = `${vertical.name} Lead Pricing — How Much Should You Pay?`;
  // Keep "coming soon" verticals (no reliable benchmark data) out of the index.
  // They stay crawlable and auto-rejoin the index once real data is added.
  const hasData = await hasTrustworthyBenchmarks(verticalSlug);
  return {
    title,
    description: `Fair market pricing benchmarks for ${vertical.name.toLowerCase()} leads. Aged, real-time, and live transfer pricing by age and exclusivity. Verified quarterly.`,
    robots: hasData ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${baseUrl}/price-index/${verticalSlug}`,
    },
    openGraph: {
      title: `${vertical.name} Lead Pricing | Work Aged Leads`,
      description: `How much do ${vertical.name.toLowerCase()} leads cost? See our quarterly verified benchmarks for aged, real-time, exclusive, and shared leads.`,
      url: `${baseUrl}/price-index/${verticalSlug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${vertical.name} Lead Pricing`)}&category=Price Index&type=tool`,
        },
      ],
    },
  };
}

export default async function VerticalPriceIndexPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: verticalSlug } = await params;
  const vertical = getVertical(verticalSlug);
  if (!vertical) return notFound();

  // Internal-linking cluster: link to this vertical's lead-type buyer's guide.
  const guideSlug = leadTypeForVertical(verticalSlug);

  // Prefer Sanity benchmarks (human-curated), fall back to the static seed,
  // and drop single-provider estimates before anything downstream uses the
  // data — the gap-fill model, price tables, "last updated" date, and trend
  // chart are all built on reliable benchmarks only. Shared with the page's
  // generateMetadata + the sitemap via the cached loader.
  const rawBenchmarks: PriceBenchmarkData[] =
    await loadTrustworthyBenchmarks(verticalSlug);

  // Use the pricing model to fill gaps in age brackets
  const latestMonth = rawBenchmarks[0]?.month || "2026-03";
  const computedGaps = fillBenchmarkGaps(verticalSlug, rawBenchmarks, latestMonth);

  // Merge real + computed benchmarks
  const allBenchmarks: PriceBenchmarkData[] = [
    ...rawBenchmarks,
    ...computedGaps.map((g) => ({
      vertical: g.vertical,
      leadAgeBracket: g.leadAgeBracket,
      exclusivity: g.exclusivity,
      leadType: g.leadType,
      month: g.month,
      priceLow: g.priceLow,
      priceMedian: g.priceMedian,
      priceHigh: g.priceHigh,
      providersSampled: g.providersSampled,
      confidence: g.confidence,
      notes: g.notes,
    })),
  ];

  const benchmarks = allBenchmarks;
  const observedCount = rawBenchmarks.length;
  const computedCount = computedGaps.length;
  const profile = getDecayProfile(verticalSlug);

  // Group benchmarks by exclusivity × leadType
  const groups: {
    exclusivity: string;
    leadType: string;
    label: string;
  }[] = [];

  const seen = new Set<string>();
  for (const b of benchmarks) {
    const key = `${b.exclusivity}:${b.leadType}`;
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({
        exclusivity: b.exclusivity,
        leadType: b.leadType,
        label: `${EXCLUSIVITY_LABELS[b.exclusivity] || b.exclusivity} — ${LEAD_TYPE_LABELS[b.leadType] || b.leadType}`,
      });
    }
  }
  const verifiedLabel = quarterLabel(latestMonth);

  // Observed monthly price trend: a SINGLE consistent aged series (same
  // bracket + exclusivity + leadType across months) with 3+ trust-passing
  // months. Observed data only — never the model-estimated gap fills. The
  // selection rule lives in lib/price-trend-series.ts, shared with
  // scripts/price-index-gap.ts so the research brief can't drift from the page.
  const trend = selectTrendSeries(rawBenchmarks);
  const trendPoints: PriceTrendPoint[] =
    trend.hasChart && trend.series ? trend.series.points : [];
  let trendSeriesLabel = "";
  if (trend.hasChart && trend.series) {
    const { leadAgeBracket: bracket, exclusivity: excl, leadType } = trend.series;
    const brLabel =
      bracket === "31-85-days"
        ? "31–85-day aged"
        : bracket === "86-180-days"
          ? "86–180-day aged"
          : bracket;
    const exclLabel = (EXCLUSIVITY_LABELS[excl] || excl).toLowerCase();
    const ltLabel = (LEAD_TYPE_LABELS[leadType] || leadType).toLowerCase();
    trendSeriesLabel = `${exclLabel}, ${brLabel} ${ltLabel} leads`;
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Price Index", url: `${baseUrl}/price-index` },
          {
            name: vertical.name,
            url: `${baseUrl}/price-index/${verticalSlug}`,
          },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/price-index"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Price Index
              </Link>
              <span>/</span>
              <span>{vertical.name}</span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              {vertical.icon} {vertical.name} Lead Pricing
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
              How much should you pay for {vertical.name.toLowerCase()} leads?
              These benchmarks represent fair market pricing ranges based on our
              quarterly verified research across multiple providers.
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Last verified: {verifiedLabel} &middot;{" "}
              {observedCount} observed data points
              {computedCount > 0 && (
                <> &middot; {computedCount} model-estimated &middot;{" "}
                  {getDecayLabel(profile.lambda)}</>
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/providers/best/${verticalSlug}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Best {vertical.name} Providers &rarr;
              </Link>
              <Link
                href="/calculators/know-your-cpl"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Calculate Your CPL &rarr;
              </Link>
            </div>
          </div>

          {/*
            Observed price trend, or an explanation of its absence.

            PriceTrendChart returns null below three verified months, which is
            correct — two points is not a trend — but that left a silent hole on
            nine of eleven vertical pages. The Q3 study tried to close it from
            public sources and filled zero of twelve cells, because one provider
            in fifteen publishes a comparable per-lead price. The panel says so
            and names who does, which is worth more to a reader than a blank.
          */}
          {trend.hasChart ? (
            <PriceTrendChart
              points={trendPoints}
              verticalName={vertical.name}
              seriesLabel={trendSeriesLabel}
            />
          ) : (
            <PriceDisclosurePanel
              verticalName={vertical.name}
              monthsAvailable={trend.months}
              monthsRequired={TREND_CHART_MIN_MONTHS}
            />
          )}

          {/* Price Tables by Group */}
          {groups.length > 0 ? (
            <div className="space-y-10">
              {groups.map((group) => (
                <div key={`${group.exclusivity}-${group.leadType}`}>
                  <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
                    {group.label}
                  </h2>
                  <PriceBenchmarkTable
                    benchmarks={benchmarks}
                    exclusivityFilter={group.exclusivity}
                    leadTypeFilter={group.leadType}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-500 dark:text-zinc-400">
                Benchmark data for {vertical.name} is coming soon. Check back
                next quarter.
              </p>
            </div>
          )}

          {/* Market Context */}
          <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              About {vertical.name} Lead Pricing
            </h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {vertical.description} Prices vary based on lead age, exclusivity,
              delivery method, and geographic targeting. Aged leads offer
              significantly lower per-lead costs but require higher volume and
              persistent follow-up to achieve comparable conversion rates.
              Real-time leads convert at higher rates but cost 10-50x more per
              lead.
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              These benchmarks are not tied to any specific provider. They
              represent fair market ranges based on our research across multiple
              sources. Actual pricing may vary based on volume, geography, and
              provider relationships.{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                See our methodology
              </Link>
              .
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-700 dark:text-zinc-300">
                Volume basis:
              </strong>{" "}
              These ranges reflect typical small-to-mid order volumes. Bulk and
              high-volume pricing is commonly negotiated lower than the ranges
              shown here.
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-700 dark:text-zinc-300">
                A note on exclusivity:
              </strong>{" "}
              Most aged leads are sold non-exclusively. Genuinely exclusive{" "}
              <em>aged</em> inventory is rare and limited — the exclusive tier
              shown here is most representative of real-time leads. Verify
              exclusivity terms directly with any provider before assuming an
              aged list is exclusive.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">Reference this data:</span>
            <CiteThisButton
              citation={`${vertical.name} lead pricing benchmarks from the Work Aged Leads Price Index, a quarterly verified study (last verified ${verifiedLabel}). Source: ${baseUrl}/price-index/${verticalSlug}`}
            />
          </div>
        </div>
      </section>

      <RelatedLinks
        title={`More on ${vertical.name.toLowerCase()} leads`}
        links={[
          guideSlug
            ? {
                href: `/lead-types/${guideSlug}`,
                label: `${vertical.name} lead buyer's guide`,
                description: `How aged ${vertical.name.toLowerCase()} leads work, pricing, and how to work them.`,
              }
            : null,
          {
            href: `/providers/best/${verticalSlug}`,
            label: `Best ${vertical.name.toLowerCase()} lead providers`,
            description: `Top-rated providers for ${vertical.name.toLowerCase()} leads, independently scored.`,
          },
          {
            href: "/calculators/know-your-cpl",
            label: "Cost-per-lead calculator",
            description: "Work out your true cost per acquired customer.",
          },
        ]}
      />

      <CtaBanner />
    </>
  );
}
