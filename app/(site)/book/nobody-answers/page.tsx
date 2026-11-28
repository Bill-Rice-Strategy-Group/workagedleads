import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { BookUpdatesSignup } from "@/components/book/book-updates-signup";
import { SECTION_CONTENT } from "@/components/book/sections";
import {
  BOOK_CHANGES,
  BOOK_SECTIONS,
  formatMonthYear,
  isPublishable,
  isStale,
  type BookSection,
} from "@/data/book-guide";
import { SITE_URL } from "@/lib/site-url";

/*
 * The Nobody Answers back-office guide.
 *
 * The book prints workagedleads.com/book (and a QR code to it). Since
 * 2026-11-28 (Bill) /book is a hub for both of Bill's books and links here;
 * it also forwards /book#<section> to this page's anchors. So this URL and the
 * section anchors (#house-rules, ...) are permanent: never delete or rename
 * them. If the guide ever moves, redirect this path. See data/book-guide.ts.
 *
 * No email gate, ever: the reader bought the book and this is the appendix it
 * promises. The only form is the optional change-notice signup.
 */

const url = `${SITE_URL}/book/nobody-answers`;

export const metadata: Metadata = {
  title: "Nobody Answers: The Back-Office Guide",
  description:
    "The step-by-step companion to the appendix of Nobody Answers: house rules, the Today page, call briefs, the long list and a free lead-list template. Every section dated.",
  alternates: { canonical: url },
};

// Re-render daily so "May be out of date" appears on time without a deploy.
export const revalidate = 86400;

function Stamp({ s }: { s: BookSection }) {
  if (isPublishable(s)) {
    const stale = isStale(s.lastChecked!);
    return (
      <p className="text-sm text-zinc-500">
        Last checked: {formatMonthYear(s.lastChecked!)}
        {stale && (
          <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            May be out of date
          </span>
        )}
      </p>
    );
  }
  return (
    <p className="text-sm text-zinc-500">
      {s.status === "legal-review" ? "In legal review" : "Being written"}
    </p>
  );
}

function Pending({ s }: { s: BookSection }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {s.status === "legal-review" ? (
        <p className="leading-relaxed">
          This section covers rules that can hurt you if they&apos;re out of date, so it goes up
          only after our lawyers have reviewed it. Until then, follow{" "}
          <strong>{s.appendixStep}</strong> in the book&apos;s appendix, and when you have a real
          question, ask a lawyer who does this for a living.
        </p>
      ) : (
        <p className="leading-relaxed">
          Not written yet. <strong>{s.appendixStep}</strong> in the book&apos;s appendix has
          everything you need to do this job without it.
        </p>
      )}
      <p className="mt-2 text-sm text-zinc-500">Coming here: {s.adds}</p>
    </div>
  );
}

export default function BookGuidePage() {
  const latest = BOOK_CHANGES[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Books", url: `${SITE_URL}/book` },
          { name: "Nobody Answers: The Back-Office Guide", url },
        ])}
      />
      <Breadcrumbs items={[{ label: "Books", href: "/book" }, { label: "The Back-Office Guide" }]} />

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          For readers of <em>Nobody Answers</em>
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Setting up your back office, step by step
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          The book&apos;s appendix covers what doesn&apos;t change: the jobs, what to ask for, what
          to check, and the rules. This page covers what does: which tools, where the settings
          are, and the exact steps. It&apos;s free, there&apos;s nothing to sign up for, and every
          section says when it was last checked.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Last change: {new Date(latest.date + "T12:00:00Z").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}{" "}
          · <Link href="/book/changes" className="underline">What changed</Link>
        </p>
      </header>

      <nav aria-label="Sections" className="mb-12 rounded-xl border border-zinc-200 p-5 print:hidden dark:border-zinc-800">
        <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
          Find the step you&apos;re on
        </p>
        <ol className="space-y-1.5 text-sm">
          {BOOK_SECTIONS.map((s) => (
            <li key={s.id} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-40 shrink-0 text-zinc-500">{s.appendixStep}</span>
              <a href={`#${s.id}`} className="font-medium text-blue-700 underline dark:text-blue-400">
                {s.title}
              </a>
              {!isPublishable(s) && (
                <span className="text-xs text-zinc-500">
                  ({s.status === "legal-review" ? "in legal review" : "coming"})
                </span>
              )}
            </li>
          ))}
          <li className="flex flex-wrap items-baseline gap-x-2">
            <span className="w-40 shrink-0 text-zinc-500">&nbsp;</span>
            <Link href="/book/changes" className="font-medium text-blue-700 underline dark:text-blue-400">
              What changed
            </Link>
          </li>
        </ol>
      </nav>

      {BOOK_SECTIONS.map((s) => {
        const Content = SECTION_CONTENT[s.id];
        return (
          <section key={s.id} id={s.id} className="mb-16 scroll-mt-24">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Appendix: {s.appendixStep}
              {s.chapter ? ` · ${s.chapter}` : ""}
            </p>
            <h2 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-white">{s.title}</h2>
            <div className="mb-6">
              <Stamp s={s} />
            </div>
            {isPublishable(s) && Content ? <Content /> : <Pending s={s} />}
          </section>
        );
      })}

      <section className="mb-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">Keeping current</h2>
        <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
          Every tool section is checked against the current product each quarter, and the
          compliance sections are reviewed by our lawyers whenever the law moves. Each change is
          listed on <Link href="/book/changes" className="underline">What changed</Link>. No tool
          on this page is an affiliate link.
        </p>
        <p className="mb-6 leading-relaxed text-zinc-700 dark:text-zinc-300">
          What won&apos;t change is the split. Let the machine do the paperwork. You keep the
          kitchen table.
        </p>
        {process.env.RESEND_BOOK_AUDIENCE_ID ? <BookUpdatesSignup /> : null}
      </section>
    </div>
  );
}
