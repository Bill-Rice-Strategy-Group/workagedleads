import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BOOK_CHANGES, BOOK_SECTIONS } from "@/data/book-guide";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "What Changed: Nobody Answers Back-Office Guide",
  description: "Every change to the Nobody Answers back-office guide, newest first.",
  alternates: { canonical: `${SITE_URL}/book/changes` },
};

export default function BookChangesPage() {
  const titles = new Map(BOOK_SECTIONS.map((s) => [s.id, s.title]));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: "The Back-Office Guide", href: "/book" }, { label: "What changed" }]} />
      <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">What changed</h1>
      <p className="mb-8 leading-relaxed text-zinc-700 dark:text-zinc-300">
        Every change to <Link href="/book" className="underline">the guide</Link>, newest first.
      </p>
      <ol className="space-y-3">
        {BOOK_CHANGES.map((c, i) => (
          <li key={i} className="flex flex-col gap-1 border-b border-zinc-100 pb-3 sm:flex-row sm:gap-4 dark:border-zinc-800">
            <time dateTime={c.date} className="w-36 shrink-0 text-sm text-zinc-500">
              {new Date(c.date + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <span className="text-zinc-800 dark:text-zinc-200">
              {c.section && (
                <Link href={`/book#${c.section}`} className="font-medium underline">
                  {titles.get(c.section)}
                </Link>
              )}
              {c.section ? ": " : ""}
              {c.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
