import type { ReactNode } from "react";
import { CtaBanner } from "@/components/cta-banner";
import { CiteThisButton } from "@/components/cite-this-button";
import { KeyTakeawayBox } from "@/components/key-takeaway-box";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedLinks, type RelatedLink } from "@/components/related-links";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  speakableWebPageJsonLd,
} from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export interface ComparisonRow {
  /** Row label (the dimension being compared). */
  label: string;
  /** Value for the left-hand option. */
  a: ReactNode;
  /** Value for the right-hand option. */
  b: ReactNode;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export interface ComparisonPageProps {
  /** Breadcrumb trail (Home is prepended automatically). Last item = this page. */
  breadcrumb: { name: string; url: string }[];
  /** Small eyebrow label above the title, e.g. "Comparison". */
  eyebrow?: string;
  title: string;
  /** Lead paragraph(s) — the answer-first summary. */
  intro: ReactNode;
  /** Plain-text takeaways; rendered as the Key Takeaways box + speakable target. */
  keyTakeaways: string;
  /** Column headers for the two things being compared. */
  columns: [string, string];
  rows: ComparisonRow[];
  /** Optional note under the table (sourcing, caveats). */
  tableNote?: ReactNode;
  /** Bespoke sections rendered between the table and the FAQ. */
  children?: ReactNode;
  faqs: ComparisonFaq[];
  relatedLinks: (RelatedLink | null | undefined)[];
  /** Citation string for the "reference this" button. */
  citation: string;
  relatedTitle?: string;
}

/**
 * Reusable, dependency-light comparison page (server component). Renders an
 * answer-first intro, a real two-column <table> (crawlable + AEO-friendly),
 * optional bespoke sections, a visible FAQ that mirrors the FAQPage JSON-LD,
 * citation, and the internal-linking cluster. Used for "aged vs real-time
 * leads" and the product-comparison pages under /compare.
 */
export function ComparisonPage({
  breadcrumb,
  eyebrow = "Comparison",
  title,
  intro,
  keyTakeaways,
  columns,
  rows,
  tableNote,
  children,
  faqs,
  relatedLinks,
  citation,
  relatedTitle = "Related resources",
}: ComparisonPageProps) {
  const [colA, colB] = columns;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", url: baseUrl }, ...breadcrumb])}
      />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <JsonLd
        data={speakableWebPageJsonLd({
          name: title,
          url: breadcrumb[breadcrumb.length - 1]?.url ?? baseUrl,
          cssSelector: [".prose-wrapper", ".key-takeaway-box"],
        })}
      />

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={breadcrumb.map((b, i) => ({
              label: b.name,
              href: i < breadcrumb.length - 1 ? b.url : undefined,
            }))}
          />

          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <div className="prose-wrapper mt-4 max-w-3xl space-y-3 text-lg text-zinc-600 dark:text-zinc-400">
            {intro}
          </div>

          <div className="mt-8">
            <KeyTakeawayBox excerpt={keyTakeaways} />
          </div>

          {/* Comparison table — real <table> for crawlers + answer engines */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th
                    scope="col"
                    className="w-1/4 p-4 font-semibold text-zinc-500 dark:text-zinc-400"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-bold text-zinc-900 dark:text-white"
                  >
                    {colA}
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-bold text-zinc-900 dark:text-white"
                  >
                    {colB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-900/40" : ""
                    }
                  >
                    <th
                      scope="row"
                      className="p-4 align-top font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      {row.label}
                    </th>
                    <td className="p-4 align-top text-zinc-600 dark:text-zinc-400">
                      {row.a}
                    </td>
                    <td className="p-4 align-top text-zinc-600 dark:text-zinc-400">
                      {row.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tableNote && (
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              {tableNote}
            </p>
          )}

          {children}

          {/* FAQ — visible copy mirrors the FAQPage JSON-LD above */}
          {faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Frequently asked questions
              </h2>
              <dl className="mt-6 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold text-zinc-900 dark:text-white">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">Reference this:</span>
            <CiteThisButton citation={citation} />
          </div>
        </div>
      </section>

      <RelatedLinks title={relatedTitle} links={relatedLinks} />

      <CtaBanner />
    </>
  );
}
