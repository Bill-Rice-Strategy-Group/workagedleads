import type { Metadata } from "next";
import { CalculatorUseTracker } from "@/components/calculators/calculator-use-tracker";
import { Suspense } from "react";
import Link from "next/link";
import { RoiCalculator } from "@/components/calculators/roi-calculator";
import { CtaBanner } from "@/components/cta-banner";
import { EmbedCode } from "@/components/embed-code";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  webApplicationJsonLd,
} from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Aged Lead ROI Calculator | Free Lead Comparison Tool",
  description:
    "Compare the ROI of aged leads vs real-time leads. Free calculator — enter your budget, conversion rates, and deal value to see which lead type delivers better returns.",
  alternates: { canonical: `${baseUrl}/calculators/roi-calculator` },
  openGraph: {
    title: "Aged Lead ROI Calculator | Free Lead Comparison Tool",
    description:
      "Compare the ROI of aged leads vs real-time leads. Free calculator — no sign-up required.",
    url: `${baseUrl}/calculators/roi-calculator`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Aged Lead ROI Calculator")}&category=Free Tool&type=calculator`,
      },
    ],
  },
};

const faqs = [
  {
    question: "What is a good ROI on aged leads?",
    answer:
      "A good ROI on aged leads depends on your industry, but most sales professionals see 200-500%+ ROI when working aged leads consistently. Because aged leads cost 80-95% less than real-time leads, even a low conversion rate (1-3%) can produce strong returns. The key is volume and follow-up consistency.",
  },
  {
    question: "How does this calculator work?",
    answer:
      "Enter your monthly lead budget, cost per lead (real-time and aged), conversion rates for each, and your average deal value. The calculator shows how many leads you can buy, expected sales, total revenue, and ROI percentage for both lead types side by side.",
  },
  {
    question: "What conversion rate should I use for aged leads?",
    answer:
      "Most industries see 1-5% conversion rates on aged leads with consistent follow-up. Insurance agents typically see 1-3%, mortgage brokers 1-2%, and final expense agents 2-5%. Start with 2% as a conservative estimate and adjust based on your actual results.",
  },
  {
    question: "Why do aged leads have a lower conversion rate but better ROI?",
    answer:
      "Aged leads convert at lower rates (1-5% vs 5-15% for real-time), but cost 80-95% less per lead. This means your budget buys 10-50x more leads. Even with a lower conversion rate, the total number of sales is often higher — and the profit margin is dramatically better because your cost per acquisition is lower.",
  },
  {
    question: "What types of aged leads are available?",
    answer:
      "Aged leads are available across many verticals including mortgage, insurance, final expense, IUL (Indexed Universal Life), solar, Medicare, SSDI (Social Security Disability), and MVA (Motor Vehicle Accident). Each vertical has different pricing and conversion characteristics.",
  },
];

export default function RoiCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Calculators", url: `${baseUrl}/calculators` },
          { name: "ROI Calculator", url: `${baseUrl}/calculators/roi-calculator` },
        ])}
      />
      <JsonLd
        data={webApplicationJsonLd({
          name: "Aged Lead ROI Calculator",
          description:
            "Compare the ROI of aged leads vs real-time leads. Free calculator for sales professionals.",
          slug: "roi-calculator",
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Calculators", href: "/calculators" },
              { label: "ROI Calculator" },
            ]}
          />

          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            Aged Lead ROI Calculator
          </h1>
          <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
            Compare the return on investment between aged leads and real-time
            leads. Enter your numbers below to see which approach delivers
            better results for your budget — no sign-up required.
          </p>

          {/* The Calculator */}
          <CalculatorUseTracker calculator="roi-calculator">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />}>
              <RoiCalculator />
            </Suspense>
          </CalculatorUseTracker>

          {/* Educational Content */}
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              How to Use This Calculator
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                This calculator helps sales professionals, insurance agents,
                mortgage brokers, and anyone who buys leads compare the
                economics of aged leads vs. real-time leads. Here&apos;s how to
                get the most accurate results:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-zinc-900 dark:text-white">Monthly Lead Budget:</strong>{" "}
                  Enter the total amount you spend (or plan to spend) on leads each month.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-white">Average Deal Value:</strong>{" "}
                  Your average commission or revenue per closed deal. For insurance,
                  use the first-year commission from your own carrier schedule, since
                  rates vary by carrier, product and contract level. For mortgage,
                  $3,000-$5,000.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-white">Lead Costs:</strong>{" "}
                  Real-time leads typically cost $15-$60+ depending on vertical.
                  Aged leads typically cost $0.50-$5.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-white">Conversion Rates:</strong>{" "}
                  Real-time leads convert at 5-15%. Aged leads convert at 1-5%
                  with consistent follow-up. Use conservative estimates.
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Why Aged Leads Typically Win on ROI
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                The math behind aged leads is straightforward: when you spend 80-95%
                less per lead, you can work 10-50x more prospects with the same budget.
                Even with a lower conversion rate, the total revenue is often significantly
                higher.
              </p>
              <p>
                Consider a $500 monthly budget in insurance:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Metric</th>
                      <th className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">Real-Time</th>
                      <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Aged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr>
                      <td className="px-4 py-3">Cost per lead</td>
                      <td className="px-4 py-3">$25</td>
                      <td className="px-4 py-3">$1</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Leads purchased</td>
                      <td className="px-4 py-3">20</td>
                      <td className="px-4 py-3">500</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Conversion rate</td>
                      <td className="px-4 py-3">10%</td>
                      <td className="px-4 py-3">2%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Closed deals</td>
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">10</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Revenue ($1,000/deal)</td>
                      <td className="px-4 py-3">$2,000</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">$10,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">ROI</td>
                      <td className="px-4 py-3">300%</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">1,900%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The difference is volume. Aged leads let you fill a massive pipeline
                and win on numbers, while real-time leads force you into a high-pressure,
                low-volume game where every lead has to count.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Tips for Maximizing Your Aged Lead ROI
            </h2>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              {[
                "Use a CRM to track every contact attempt — most sales happen after 5-7 touches",
                "Segment leads by recency: work 30-60 day leads first, then 60-90, then 90+",
                "Use a multi-channel approach: phone, email, direct mail, and door knocking",
                "Use the 'Honest Follow-Up' script — acknowledge the time gap, don't fake familiarity",
                "Track your actual conversion rate and adjust the calculator inputs monthly",
                "Start with a small batch (100-200 leads) to test your process before scaling",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mt-12">
            <NewsletterSignup
              variant="card"
              heading="Get Weekly ROI Tips"
              description="Strategies for maximizing your return on aged leads. Free, no spam."
              context="roi-calculator"
            />
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Calculators */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
              Related Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/calculators"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <span className="text-2xl">📊</span>
                <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">
                  All Calculators
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Browse all free sales tools and calculators
                </p>
              </Link>
              <Link
                href="/lead-types"
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <span className="text-2xl">📋</span>
                <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">
                  Lead Types
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Explore aged leads by industry and vertical
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <EmbedCode calculatorName="Aged Lead ROI Calculator" calculatorSlug="roi-calculator" />
      </div>
      <CtaBanner campaign="roi-calculator" />
    </>
  );
}
