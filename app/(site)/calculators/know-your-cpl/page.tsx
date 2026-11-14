import type { Metadata } from "next";
import { CalculatorUseTracker } from "@/components/calculators/calculator-use-tracker";
import { Suspense } from "react";
import { KnowYourCplCalculator } from "@/components/calculators/know-your-cpl-calculator";
import { CtaBanner } from "@/components/cta-banner";
import { EmbedCode } from "@/components/embed-code";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Know Your CPL — What Should You Pay for Leads?",
  description:
    "Calculate your maximum cost per lead based on your vertical, close rate, and deal value. Compare aged vs. real-time lead ROI side by side.",
  alternates: { canonical: `${baseUrl}/calculators/know-your-cpl` },
  openGraph: {
    title: "Know Your CPL Calculator | Work Aged Leads",
    description:
      "Input your business metrics, get personalized lead pricing recommendations. Compare aged vs. real-time ROI instantly.",
    url: `${baseUrl}/calculators/know-your-cpl`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Know Your CPL Calculator")}&category=Free Tool&type=calculator`,
      },
    ],
  },
};

export default function KnowYourCplPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Calculators", url: `${baseUrl}/calculators` },
          {
            name: "Know Your CPL",
            url: `${baseUrl}/calculators/know-your-cpl`,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Know Your CPL Calculator",
          url: `${baseUrl}/calculators/know-your-cpl`,
          applicationCategory: "BusinessApplication",
          description:
            "Calculate your maximum cost per lead and compare aged vs. real-time lead ROI for any sales vertical.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Know Your CPL" }]} />

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Lead Marketwatch
              </span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Know Your CPL
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              What should you be paying for leads? Input your business
              metrics and we&apos;ll calculate your maximum CPL, then show you how
              aged leads compare to real-time leads for your specific situation.
            </p>
          </div>

          <CalculatorUseTracker calculator="know-your-cpl">
            <Suspense
              fallback={
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-zinc-500">Loading calculator...</p>
                </div>
              }
            >
              <KnowYourCplCalculator />
            </Suspense>
          </CalculatorUseTracker>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <EmbedCode calculatorName="Know Your CPL Calculator" calculatorSlug="know-your-cpl" />
      </div>
      <CtaBanner />
    </>
  );
}
