import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { TrackedOutboundLink } from "@/components/tracked-outbound-link";
import { GuideAnchorForward } from "@/components/book/guide-anchor-forward";
import { BOOK_SECTIONS } from "@/data/book-guide";
import { BOOK } from "@/lib/book";
import { SITE_URL } from "@/lib/site-url";

/*
 * /book — the hub for Bill's books (Bill, 2026-11-28).
 *
 * TWO THINGS DEPEND ON THIS URL, SO IT MUST ALWAYS RESOLVE:
 * 1. Nobody Answers prints workagedleads.com/book, and a QR code to it, as the
 *    home of its back-office guide. Readers holding the book land here.
 * 2. The Sales Team of One launch email (scheduled 2026-12-17) links /book
 *    with campaign UTMs.
 *
 * Each book has its own page under it. Never delete or repurpose /book; if
 * the books' pages move, keep this hub pointing at them.
 */

const url = `${SITE_URL}/book`;

export const metadata: Metadata = {
  title: "Books by Bill Rice: Nobody Answers and Sales Team of One",
  description:
    "Bill Rice's books. Reading Nobody Answers? The free back-office guide it points to is here. Plus Sales Team of One, on staying irreplaceable when AI comes for the sales team.",
  alternates: { canonical: url },
};

export default function BooksHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <GuideAnchorForward ids={BOOK_SECTIONS.map((s) => s.id)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Books", url },
        ])}
      />
      <Breadcrumbs items={[{ label: "Books" }]} />

      <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Books by Bill Rice
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        Two books, both about doing the human part of selling well while the machines do the
        rest.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col rounded-2xl border-2 border-blue-600 p-6 dark:border-blue-500">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Reading this one? Start here
          </p>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            <em>Nobody Answers</em>
          </h2>
          <p className="mt-3 flex-1 leading-relaxed text-zinc-700 dark:text-zinc-300">
            The book&apos;s appendix sends you here for the back-office setup, step by step: house
            rules, the <em>Today</em> page, the call brief, the long list and a free list template.
            Free, nothing to sign up for, and every section dated.
          </p>
          <Link
            href="/book/nobody-answers"
            className="mt-6 inline-block self-start rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Open the back-office guide
          </Link>
        </section>

        <section className="flex flex-col rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="flex gap-4">
            <Image
              src={BOOK.coverPath}
              alt={BOOK.coverAlt}
              width={96}
              height={153}
              className="h-auto w-24 shrink-0 rounded shadow"
            />
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                <em>{BOOK.title}</em>
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{BOOK.subtitle}</p>
            </div>
          </div>
          <p className="mt-4 flex-1 leading-relaxed text-zinc-700 dark:text-zinc-300">
            {BOOK.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/book/sales-team-of-one"
              className="rounded-lg border border-zinc-300 px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              About the book
            </Link>
            <TrackedOutboundLink
              href={BOOK.amazonUrl}
              ctaId="book-amazon-hub"
              ctaLocation="book-hub"
              className="font-semibold text-blue-700 underline dark:text-blue-400"
            >
              Get it on Amazon Kindle
            </TrackedOutboundLink>
          </div>
        </section>
      </div>
    </div>
  );
}
