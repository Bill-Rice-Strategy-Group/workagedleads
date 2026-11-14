import { Suspense } from "react";
import { CalculatorUseTracker } from "@/components/calculators/calculator-use-tracker";
import type { Metadata } from "next";
import Link from "next/link";
import { PipelineCalculator } from "@/components/calculators/pipeline-calculator";
import { CtaBanner } from "@/components/cta-banner";
import { EmbedCode } from "@/components/embed-code";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Pipeline Volume Calculator | Free Sales Pipeline Planner",
  description:
    "Figure out exactly how many aged leads you need to hit your revenue goals. Free pipeline calculator — enter your target monthly revenue, close rate, and deal value.",
  alternates: { canonical: `${baseUrl}/calculators/pipeline-calculator` },
  openGraph: {
    title: "Pipeline Volume Calculator | Free Sales Pipeline Planner",
    description: "Figure out how many aged leads you need to hit your revenue goals. Free — no sign-up required.",
    url: `${baseUrl}/calculators/pipeline-calculator`,
    images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent("Pipeline Volume Calculator")}&category=Free Tool&type=calculator` }],
  },
};

const faqs = [
  { question: "How many leads do I need per month?", answer: "It depends on your revenue goal, deal value, contact rate, and close rate. For example, if you want $10,000/month in revenue from $1,000 deals with a 12% contact rate and 2% close rate, you need about 4,167 leads. Use the calculator above with your specific numbers." },
  { question: "How many dials per day is realistic?", answer: "For a solo agent manually dialing, 80-120 dials per day is sustainable for a full-time calling session. With a power dialer, 150-200+ dials per day is achievable. If the calculator shows you need more dials than you can make, consider buying fewer leads with higher contact rates (fresher aged leads) or improving your close rate." },
  { question: "What if I can't afford enough leads to hit my revenue goal?", answer: "Start with what you can afford and reinvest profits. If you can only buy 200 leads, work them thoroughly with a multi-channel cadence. Use the revenue from those sales to buy your next batch. Most successful aged lead operations started small and scaled over 3-6 months." },
];

export default function PipelineCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: baseUrl }, { name: "Calculators", url: `${baseUrl}/calculators` }, { name: "Pipeline Calculator", url: `${baseUrl}/calculators/pipeline-calculator` }])} />
      <JsonLd data={webApplicationJsonLd({ name: "Pipeline Volume Calculator", description: "Calculate how many leads you need to hit your revenue goals.", slug: "pipeline-calculator" })} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Pipeline Calculator" }]} />

          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Pipeline Volume Calculator</h1>
          <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
            Work backwards from your revenue goal. Enter your target monthly revenue, average deal value, and conversion metrics to see exactly how many leads you need to buy, how many dials you need to make, and what it will cost.
          </p>

          <CalculatorUseTracker calculator="pipeline-calculator">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />}>
              <PipelineCalculator />
            </Suspense>
          </CalculatorUseTracker>

          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">How to Use This Calculator</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Most sales professionals set revenue goals but don&apos;t reverse-engineer the activity required to hit them. This calculator bridges that gap — it tells you the exact volume of leads, contacts, and dials you need each month.</p>
              <p>The <strong className="text-zinc-900 dark:text-white">funnel visualization</strong> shows your pipeline narrowing from leads purchased → contacts made → deals closed. Each stage is a lever you can optimize: buy more leads, improve your contact rate (better timing, multi-channel outreach), or improve your close rate (better scripts, faster follow-up).</p>
              <p>The <strong className="text-zinc-900 dark:text-white">dials per day</strong> number is your daily activity target. If it feels unachievable, you have two options: reduce your revenue goal, or improve your conversion metrics so you need fewer leads to reach the same result. Most agents find that consistent daily activity (even 60-80 dials) compounds into significant results over a month.</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Pipeline Math by Industry</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Here&apos;s what a $10,000/month pipeline looks like in different verticals using aged leads:</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Vertical</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Avg Deal</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Deals Needed</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Leads Needed</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Lead Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400">
                  {[
                    ["Final Expense", "$500", "20", "~800", "~$800"],
                    ["Insurance (P&C)", "$800", "13", "~550", "~$550"],
                    ["IUL", "$3,000", "4", "~170", "~$500"],
                    ["Mortgage", "$3,500", "3", "~210", "~$420"],
                    ["Solar", "$3,000", "4", "~270", "~$540"],
                    ["Medicare", "$600", "17", "~700", "~$700"],
                  ].map(([v, d, dn, ln, lb]) => (
                    <tr key={v}><td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{v}</td><td className="px-4 py-3">{d}</td><td className="px-4 py-3">{dn}</td><td className="px-4 py-3">{ln}</td><td className="px-4 py-3">{lb}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12"><NewsletterSignup variant="card" heading="Plan Your Pipeline" description="Weekly strategies for building predictable income with aged leads." context="pipeline-calculator" /></div>

          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">FAQ</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link href="/calculators/roi-calculator" className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
              <span className="text-2xl">📊</span>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">ROI Calculator</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Compare aged vs. real-time lead ROI</p>
            </Link>
            <Link href="/calculators/lead-cost-calculator" className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
              <span className="text-2xl">💰</span>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">Lead Cost Calculator</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Calculate your true cost per acquisition</p>
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <EmbedCode calculatorName="Pipeline Volume Calculator" calculatorSlug="pipeline-calculator" />
      </div>
      <CtaBanner campaign="pipeline-calculator" />
    </>
  );
}
