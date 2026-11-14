import { Suspense } from "react";
import { CalculatorUseTracker } from "@/components/calculators/calculator-use-tracker";
import type { Metadata } from "next";
import Link from "next/link";
import { OutreachCadencePlanner } from "@/components/calculators/outreach-cadence-planner";
import { CtaBanner } from "@/components/cta-banner";
import { EmbedCode } from "@/components/embed-code";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Outreach Cadence Planner | Free Multi-Channel Follow-Up Tool",
  description:
    "Plan your multi-channel outreach cadence for aged leads. Map phone calls, emails, direct mail, texts, and door knocks across a 7, 14, or 21-day follow-up sequence.",
  alternates: { canonical: `${baseUrl}/calculators/outreach-cadence-planner` },
  openGraph: {
    title: "Outreach Cadence Planner | Free Multi-Channel Follow-Up Tool",
    description: "Plan your multi-channel outreach cadence for aged leads. Free — no sign-up required.",
    url: `${baseUrl}/calculators/outreach-cadence-planner`,
    images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent("Outreach Cadence Planner")}&category=Free Tool&type=calculator` }],
  },
};

const faqs = [
  { question: "How many touches does it take to convert an aged lead?", answer: "Industry research shows it takes 6-8 touches on average to convert a prospect into a sale. For aged leads specifically, a minimum of 5 touches across multiple channels over 7 days is recommended. Extending to a 14 or 21-day cadence with 8-11 touches significantly increases contact rates, especially when mixing phone, email, and direct mail." },
  { question: "What is the best channel mix for aged lead outreach?", answer: "The most effective aged lead cadences combine phone calls with at least two other channels. Phone remains the highest-converting channel, but adding email, direct mail, or SMS increases your overall contact rate by 30-50%. Direct mail works especially well for leads that have gone uncontacted — a physical mailer can warm them up before your call." },
  { question: "How many calls per day can a solo agent realistically make?", answer: "A solo agent manually dialing can sustain 60-80 dials per day during a focused calling block. With a power dialer, 120-200+ dials per day is achievable. The key is consistency — 80 dials per day, 5 days per week, across a structured cadence will outperform sporadic bursts of 200 dials followed by days of no activity." },
];

export default function OutreachCadencePlannerPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: baseUrl }, { name: "Calculators", url: `${baseUrl}/calculators` }, { name: "Outreach Cadence Planner", url: `${baseUrl}/calculators/outreach-cadence-planner` }])} />
      <JsonLd data={webApplicationJsonLd({ name: "Outreach Cadence Planner", description: "Plan your multi-channel outreach cadence for aged leads.", slug: "outreach-cadence-planner" })} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Outreach Cadence Planner" }]} />

          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Outreach Cadence Planner</h1>
          <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
            Map out your multi-channel follow-up sequence for aged leads. Choose your channels, set your capacity, and get a day-by-day activity plan with time estimates so you know exactly what your daily workload looks like.
          </p>

          <CalculatorUseTracker calculator="outreach-cadence-planner">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />}>
              <OutreachCadencePlanner />
            </Suspense>
          </CalculatorUseTracker>

          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">How to Use This Calculator</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Start by entering the number of leads you plan to work. Then choose a cadence length — 7 days for a fast, intensive push, 14 days for a balanced approach, or 21 days for a thorough long-game follow-up. Toggle on the channels you actually use in your outreach.</p>
              <p>The <strong className="text-zinc-900 dark:text-white">daily activity breakdown</strong> shows how many of each activity you need to complete per working day to stay on track. Use this as your daily checklist. The time estimate helps you block the right amount of time in your calendar.</p>
              <p>The <strong className="text-zinc-900 dark:text-white">cadence timeline</strong> at the bottom is your visual playbook. It shows which channel to use on which day of the sequence — so you never have to guess what comes next. Print it out or screenshot it for quick reference during your calling sessions.</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Contact Attempt Benchmarks by Channel</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>How many attempts does it take to reach a prospect? Here are industry benchmarks for aged leads across common outreach channels:</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Channel</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Avg Attempts to Contact</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Contact Rate</th>
                    <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Best Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400">
                  {[
                    ["Phone", "6-8 dials", "8-15%", "9-11 AM, 4-6 PM"],
                    ["Email", "3-5 sends", "15-25% open", "Tue-Thu, 10 AM"],
                    ["Text/SMS", "1-2 sends", "30-45% open", "10 AM - 2 PM"],
                    ["Direct Mail", "1-2 pieces", "1-3% response", "Arrives Mon-Wed"],
                    ["Door Knock", "2-3 visits", "20-40% answer", "Sat 10 AM - 2 PM"],
                  ].map(([ch, attempts, rate, time]) => (
                    <tr key={ch}><td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{ch}</td><td className="px-4 py-3">{attempts}</td><td className="px-4 py-3">{rate}</td><td className="px-4 py-3">{time}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12"><NewsletterSignup variant="card" heading="Master Your Cadence" description="Weekly tips on multi-channel outreach strategies for aged leads." context="cadence-planner" /></div>

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
            <Link href="/calculators/pipeline-calculator" className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
              <span className="text-2xl">📈</span>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">Pipeline Calculator</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">How many leads do you need to hit your income goal?</p>
            </Link>
            <Link href="/calculators/roi-calculator" className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
              <span className="text-2xl">📊</span>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">ROI Calculator</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Compare aged vs. real-time lead ROI</p>
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <EmbedCode calculatorName="Outreach Cadence Planner" calculatorSlug="outreach-cadence-planner" />
      </div>
      <CtaBanner campaign="cadence-planner" />
    </>
  );
}
