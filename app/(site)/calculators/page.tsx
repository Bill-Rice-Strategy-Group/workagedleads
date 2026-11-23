import type { Metadata } from "next";
import { PROVIDERS } from "@/data/providers";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { NextStepRouter } from "@/components/next-step-router";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Free Sales Calculators & Tools",
  description:
    "Free calculators and interactive tools for sales professionals. ROI calculators, lead cost analysis, and prospecting tools — no sign-up required.",
  alternates: { canonical: `${baseUrl}/calculators` },
  openGraph: {
    title: "Free Sales Calculators & Tools | Work Aged Leads",
    description:
      "5 free interactive tools: pipeline volume calculator, Know Your CPL, ROI calculator, lead cost calculator, and outreach cadence planner. No sign-up required.",
    url: `${baseUrl}/calculators`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Free Sales Calculators & Tools")}&category=Free Tools&type=calculator`,
      },
    ],
  },
};

/**
 * `nextStep` — Click Loop iteration P4, 2026-10-05.
 *
 * /calculators drew 374 views and produced 1 affiliate click in the measured
 * window, while the lead-type and provider pages converted at 22.8%. Both
 * calculator result doors were killed today for returning zero store sessions
 * across their whole life (ledger kills[], iteration 5), so the response here is
 * routing rather than another placement.
 *
 * Each tool answers a different question, so each one's natural follow-on is a
 * different page: a volume answer leads to who can supply it, a price answer
 * leads to the benchmarks, and a per-vertical answer leads to the vertical
 * guide. One destination per tool, chosen for that tool — never a generic
 * "see also" row repeated five times.
 */
const CALCULATORS = [
  {
    title: "Pipeline Volume Calculator",
    slug: "pipeline-calculator",
    description:
      "Determine how many leads you need to hit your income goals based on your close rate and average deal size. Our most-used tool — start here.",
    icon: "📈",
    status: "live",
    popular: true,
    nextStep: { href: "/providers", label: "Who can supply that volume" },
  },
  {
    title: "Know Your CPL",
    slug: "know-your-cpl",
    description:
      "Calculate your maximum cost per lead based on your vertical, close rate, and deal value. Compare aged vs. real-time ROI side by side.",
    icon: "🎯",
    status: "live",
    nextStep: {
      href: "/price-index",
      label: "Check your ceiling against the market",
    },
  },
  {
    title: "Aged Lead ROI Calculator",
    slug: "roi-calculator",
    description:
      "Compare the ROI of aged leads vs. real-time leads. Input your budget, conversion rates, and deal values to see the difference.",
    icon: "📊",
    status: "live",
    nextStep: {
      href: "/lead-types",
      label: "How the economics differ by vertical",
    },
  },
  {
    title: "Lead Cost Calculator",
    slug: "lead-cost-calculator",
    description:
      "Calculate your true cost per acquisition when factoring in lead cost, contact rate, and conversion rate.",
    icon: "💰",
    status: "live",
    nextStep: {
      href: "/price-index",
      label: "Current benchmarks by vertical",
    },
  },
  {
    title: "Outreach Cadence Planner",
    slug: "outreach-cadence-planner",
    description:
      "Plan your multi-channel follow-up sequence for aged leads — calls, emails, direct mail, and door knocking.",
    icon: "📅",
    status: "live",
    nextStep: {
      href: "/lead-types",
      label: "How each lead type gets worked",
    },
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Calculators", url: `${baseUrl}/calculators` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Free Sales Calculators",
          description:
            "Interactive tools for sales professionals to calculate ROI, lead costs, pipeline volume, and outreach cadences.",
          numberOfItems: CALCULATORS.length,
          itemListElement: CALCULATORS.map((calc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: calc.title,
            url: `${baseUrl}/calculators/${calc.slug}`,
          })),
        }}
      />
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Free Sales Calculators
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Interactive tools to help you analyze deals, plan your pipeline,
              and maximize your return on aged leads. No sign-up required.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {CALCULATORS.map((calc) => (
              <div
                key={calc.slug}
                className={`relative flex flex-col rounded-xl border bg-white p-6 dark:bg-zinc-900 ${
                  calc.popular
                    ? "border-blue-500 ring-1 ring-blue-500/40 dark:border-blue-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {calc.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    Most popular
                  </span>
                )}
                <span className="mb-3 text-3xl">{calc.icon}</span>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {calc.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {calc.description}
                </p>
                <Link
                  href={`/calculators/${calc.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Open Calculator &rarr;
                </Link>
                {calc.nextStep && (
                  <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                    <Link
                      href={calc.nextStep.href}
                      className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                    >
                      <span className="font-medium">Then:</span>
                      <span>{calc.nextStep.label}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Internal routing, not a door — Click Loop iteration P4, 2026-10-05.

        For the reader who browses the tools without opening one. A calculator
        answers only as well as the figures put into it, and the two pages that
        test those figures are both first-party. Nothing here links to a store:
        the calculator result doors were killed today for producing zero store
        sessions over their entire life (ledger kills[], iteration 5), and the
        lesson recorded there is that supplying inputs does not make a reader a
        buyer. So this routes to where the real numbers live instead.
      */}
      <NextStepRouter
        heading="Every figure above is one you supplied"
        intro="These tools are honest about arithmetic and silent about the market. Two pages tell you whether the assumptions you just typed in survive contact with it."
        items={[
          {
            href: "/price-index",
            label: "Lead Price Index",
            description:
              "Quarterly benchmarks for aged, real-time and live-transfer leads across fifteen verticals, with the sourcing shown — so the cost per lead you assumed has something to be measured against.",
            icon: "pricing",
          },
          {
            href: "/providers",
            label: "Provider comparison",
            description:
              `Which sellers publish what they charge and which make you ask, scored alongside verticals covered, data age and replacement terms. Only one of the ${PROVIDERS.length} we have reviewed posts a comparable per-lead price.`,
            icon: "providers",
          },
        ]}
      />

      <CtaBanner />
    </>
  );
}
