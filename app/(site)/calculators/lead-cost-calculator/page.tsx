import { Suspense } from "react";
import { CalculatorUseTracker } from "@/components/calculators/calculator-use-tracker";
import type { Metadata } from "next";
import Link from "next/link";
import { LeadCostCalculator } from "@/components/calculators/lead-cost-calculator";
import { CtaBanner } from "@/components/cta-banner";
import { EmbedCode } from "@/components/embed-code";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Lead Cost Calculator | Free Cost Per Acquisition Tool",
  description:
    "Calculate your true cost per acquisition, break-even close rate, and ROI from aged leads. Free calculator for insurance agents, mortgage brokers, and sales professionals.",
  alternates: { canonical: `${baseUrl}/calculators/lead-cost-calculator` },
  openGraph: {
    title: "Lead Cost Calculator | Free Cost Per Acquisition Tool",
    description: "Calculate your true cost per acquisition from aged leads. Free — no sign-up required.",
    url: `${baseUrl}/calculators/lead-cost-calculator`,
    images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent("Lead Cost Calculator")}&category=Free Tool&type=calculator` }],
  },
};

const faqs = [
  { question: "What is cost per acquisition (CPA)?", answer: "Cost per acquisition is the total amount you spend on leads to acquire one paying customer. It's calculated by dividing your total lead spend by the number of closed deals. CPA is a more accurate profitability metric than cost per lead because it accounts for your conversion rate." },
  { question: "What's a good CPA for aged leads?", answer: "A good CPA varies by industry. For insurance agents, $50-$150 per policy is strong. For mortgage brokers, $200-$500 per closed loan is typical. For final expense agents, $30-$80 per policy. The key is that your CPA is significantly lower than your revenue per sale." },
  { question: "What is a break-even close rate?", answer: "Your break-even close rate is the minimum percentage of contacted leads you need to close in order to cover your lead costs. If your break-even rate is 1% and you're closing at 3%, you have healthy margins. If you're below break-even, adjust your scripts or lead quality." },
  { question: "How do I improve my cost per acquisition?", answer: "Three levers: improve your contact rate (call at better times, use multi-channel outreach), improve your close rate (better scripts, faster follow-up), or reduce your cost per lead (buy older leads, negotiate volume discounts). Even small improvements compound significantly at scale." },
];

export default function LeadCostCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: baseUrl }, { name: "Calculators", url: `${baseUrl}/calculators` }, { name: "Lead Cost Calculator", url: `${baseUrl}/calculators/lead-cost-calculator` }])} />
      <JsonLd data={webApplicationJsonLd({ name: "Lead Cost Calculator", description: "Calculate your true cost per acquisition from aged leads.", slug: "lead-cost-calculator" })} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Lead Cost Calculator" }]} />

          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Lead Cost Calculator</h1>
          <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
            Your cost per lead is just the starting point. This calculator shows your true cost per acquisition — factoring in contact rate, close rate, and deal value. Find your break-even point and see your real ROI.
          </p>

          <CalculatorUseTracker calculator="lead-cost-calculator">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />}>
              <LeadCostCalculator />
            </Suspense>
          </CalculatorUseTracker>

          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Understanding Your Numbers</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Most sales professionals focus on cost per lead (CPL) when evaluating their lead sources. But CPL is misleading — a $0.50 lead that never picks up the phone is more expensive than a $3 lead that answers and converts. The metric that actually determines your profitability is <Link href="/glossary/cost-per-acquisition" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">cost per acquisition (CPA)</Link>.</p>
              <p>CPA accounts for the entire journey from lead to sale: how many leads you buy, how many you actually reach, and how many of those conversations turn into deals. It&apos;s the number you should track weekly and optimize against — not the price you pay per record.</p>
              <p>The <strong className="text-zinc-900 dark:text-white">break-even close rate</strong> is especially useful. It tells you the minimum you need to close to cover your lead costs. If your break-even is 1.5% and you&apos;re consistently closing at 3%, you have a sustainable, profitable system that you can scale with confidence.</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Industry Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Industry</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Typical Contact Rate</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Typical Close Rate</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Target CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400">
                  {[
                    ["Insurance", "10-15%", "15-25%", "$50-$150"],
                    ["Final Expense", "12-18%", "20-30%", "$30-$80"],
                    ["Mortgage", "8-12%", "10-20%", "$200-$500"],
                    ["Solar", "10-15%", "8-15%", "$150-$400"],
                    ["Medicare", "12-18%", "15-25%", "$40-$100"],
                    ["SSDI", "12-18%", "40-55%", "$30-$60"],
                  ].map(([ind, cr, clr, cpa]) => (
                    <tr key={ind}><td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{ind}</td><td className="px-4 py-3">{cr}</td><td className="px-4 py-3">{clr}</td><td className="px-4 py-3">{cpa}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12"><NewsletterSignup variant="card" heading="Track Your Numbers" description="Weekly tips on measuring and improving your lead conversion economics." context="lead-cost-calculator" /></div>

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
            <Link href="/calculators/pipeline-calculator" className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
              <span className="text-2xl">📈</span>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">Pipeline Calculator</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Plan how many leads you need to hit income goals</p>
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <EmbedCode calculatorName="Lead Cost Calculator" calculatorSlug="lead-cost-calculator" />
      </div>
      <CtaBanner campaign="lead-cost-calculator" />
    </>
  );
}
