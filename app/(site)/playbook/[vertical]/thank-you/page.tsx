import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FLAGSHIP_VERTICALS, allFlagshipVerticals } from "@/data/flagship-verticals";
import type { Vertical } from "@/lib/email-course/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { affiliateUrl } from "@/lib/affiliate";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

interface PageProps {
  params: Promise<{ vertical: string }>;
}

function isVertical(v: string): v is Vertical {
  return v === "mortgage" || v === "insurance" || v === "home-services";
}

export async function generateStaticParams() {
  return allFlagshipVerticals().map((v) => ({ vertical: v.slug }));
}

export const metadata: Metadata = {
  title: "You're in — your playbook is ready",
  description: "Your Aged Lead Operator's System playbook and workbook are ready to download.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default async function FlagshipThankYouPage({ params }: PageProps) {
  const { vertical } = await params;
  if (!isVertical(vertical)) notFound();

  const config = FLAGSHIP_VERTICALS[vertical];

  const storeUrl = affiliateUrl({
    campaign: config.affiliateCampaign,
    content: "thank-you",
  });

  return (
    <>
      <section className="bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <svg
              className="h-8 w-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            You&apos;re in.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300">
            Your <strong>{config.title}</strong> playbook and workbook are below. Check your inbox for the first email — the rest of the course arrives over the next 10 days.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Playbook", href: "/playbook" },
              { label: config.title, href: `/playbook/${vertical}` },
              { label: "Thank You" },
            ]}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <a
              href={config.playbookPdfPath}
              download
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-50 p-8 text-center transition hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950"
            >
              <div className="text-4xl">📘</div>
              <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
                The Playbook
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                40+ pages. Scripts, unit economics, cadence, nurture, compliance.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Download PDF
              </span>
            </a>

            <a
              href={config.workbookPdfPath}
              download
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-zinc-300 bg-white p-8 text-center transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="text-4xl">📝</div>
              <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
                The Workbook
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                10 worksheets. Fill in your numbers and build your operating plan.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-900 dark:border-white dark:text-white">
                Download PDF
              </span>
            </a>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              What&apos;s next
            </h2>
            <ol className="mt-6 space-y-4">
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  1
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Check your inbox.
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    The Day 0 email arrives within 15–20 minutes. If you don&apos;t see it, check promotions/spam and mark it safe.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  2
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Read Part I and II of the playbook. Fill Worksheet 1.
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    About 30 minutes. Tells you whether aged-lead economics work for your specific product.
                  </p>
                  {/* The pipeline calculator is the site's best on-site
                      converter (BACKLOG P1, 2026-06-13/19) and does the same
                      work as Worksheet 1 in seconds — so it belongs here, at
                      the moment a new subscriber is about to run the numbers. */}
                  <Link
                    href="/calculators/pipeline-calculator"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Run your numbers in the Pipeline Volume Calculator →
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  3
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Over the next 10 days, 4 more emails arrive.
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Day 2: tech stack. Day 4: scripts. Day 7: nurture. Day 10: compliance + 90-day diagnostic.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  4
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    When you&apos;re ready to run leads — start small.
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    The playbook recommends a test batch at 50–70% of your max viable CPL.
                  </p>
                  <a
                    href={storeUrl}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    See aged {config.title.toLowerCase()} leads at AgedLeadStore →
                  </a>
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500">
              Questions?{" "}
              <Link
                href="/contact"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Reply to any of the course emails
              </Link>
              , or send me a note. I read everything.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
