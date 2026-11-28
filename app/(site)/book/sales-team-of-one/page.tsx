import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { TrackedOutboundLink } from "@/components/tracked-outbound-link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { billRiceRef } from "@/lib/identity";
import { BOOK } from "@/lib/book";

/**
 * /book/sales-team-of-one — Bill's book, "Sales Team of One".
 *
 * Moved here from /book on 2026-11-28 (Bill): /book is now a hub for both of
 * Bill's books, because Nobody Answers prints /book in a QR code. The launch
 * email (scheduled 2026-12-17) links /book and lands on the hub, which links here.
 *
 * WHY (Bill, 2026-11-27)
 *
 * The newsletter promotes the book as a supporting campaign, not as an equal of
 * the Aged Lead Store offers: one launch email plus an occasional P.S. Email
 * links land here rather than on Amazon so the visit is measurable in GA4 (UTM
 * session + cta_click on the Amazon button) and the page can be indexed.
 *
 * Copy rules:
 * - No price and no review count. Amazon sets the price and we can't watch
 *   it; the book has no reviews yet. Don't invent either.
 * - Say plainly that the story follows a software founder. Readers here work
 *   leads, so the page has to make that bridge honestly.
 * - No first-person lead-buying claims (Bill is not a current lead buyer).
 * - The Amazon link carries no Associates tag. If one is added, add an
 *   affiliate disclosure next to it.
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";
const pageUrl = `${baseUrl}/book/sales-team-of-one`;

export const metadata: Metadata = {
  title: `${BOOK.title}: ${BOOK.subtitle} | Bill Rice`,
  description:
    "Bill Rice's book for founders, solo sellers and anyone handed a number and no headcount: how to stay irreplaceable when AI automates the effort side of selling.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `${BOOK.title} — Bill Rice`,
    description: BOOK.tagline,
    url: pageUrl,
    type: "book",
    images: [{ url: `${baseUrl}${BOOK.coverPath}`, width: 600, height: 959, alt: BOOK.coverAlt }],
  },
};

const INSIDE = [
  "Why fascination beats discipline as a strategy, and how to find yours",
  "How to build expertise in public when you are starting from nothing",
  "The audience engine: turning what you know into inbound you did not chase",
  "Running a big deal on two clocks at once without losing your nerve",
  "Where AI is genuine leverage, and the exact places using it costs you the deal",
  "The systems that let one person carry a pipeline that used to need a team",
];

const FOR_LEAD_WORKERS = [
  {
    heading: "You already are a sales team of one",
    body: "If you work leads for a living, you prospect, follow up, present, close and keep your own pipeline full. Nobody hands you a marketing department. The book is written for exactly that seat.",
  },
  {
    heading: "AI makes effort cheap. Expertise stays scarce",
    body: "A machine can now write and send two thousand follow-ups in an afternoon. What it can't fake is someone who knows a product, a market and a borrower's or family's situation better than anyone else they've talked to. The book is about building that.",
  },
  {
    heading: "Use AI where it helps, not where it costs you",
    body: "One chapter is about where AI is real leverage for a solo seller, and the places where leaning on it loses you the deal. It's the same line we draw on this site for aged leads: let AI do the busywork, and keep the conversations human.",
  },
];

const FAQ = [
  {
    q: "Is this book about aged leads?",
    a: "No. It's about selling on your own when AI can do the repetitive work. The story follows a software founder, Marcus Reyes, over one year. The method underneath it — go deep, build trust in public, let systems carry the pipeline — applies to anyone selling on their own, including agents and loan officers who work leads.",
  },
  {
    q: "Is it a story or a how-to book?",
    a: "Both. Each chapter is a scene from Marcus's year, and each one closes with the framework underneath it, so you can lift the method out and use it.",
  },
  {
    q: "What formats is it in?",
    a: `Kindle, about ${BOOK.printLength} pages. Get it on Amazon; you can read it on a Kindle or in the free Kindle app on your phone or computer.`,
  },
  {
    q: "Who wrote it?",
    a: "Bill Rice, who writes the guides and playbooks on Work Aged Leads. He has spent 30+ years in lead generation and sales, and also wrote The Lead Buyer's Playbook.",
  },
];

export default function BookPage() {
  const amazonHref = BOOK.amazonUrl;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Books", url: `${baseUrl}/book` },
          { name: BOOK.title, url: pageUrl },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          "@id": `${pageUrl}#book`,
          name: `${BOOK.title}: ${BOOK.subtitle}`,
          author: billRiceRef,
          publisher: { "@type": "Organization", name: BOOK.publisher },
          datePublished: BOOK.datePublished,
          isbn: BOOK.isbn13,
          numberOfPages: BOOK.printLength,
          bookFormat: "https://schema.org/EBook",
          inLanguage: "en",
          image: `${baseUrl}${BOOK.coverPath}`,
          url: pageUrl,
          sameAs: [amazonHref],
          description: BOOK.tagline,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-white py-12 sm:py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Books", href: "/book" }, { label: BOOK.title }]} />

          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,280px)_1fr] lg:gap-16">
            <div className="mx-auto w-48 sm:w-60 md:w-full">
              <Image
                src={BOOK.coverPath}
                alt={BOOK.coverAlt}
                width={600}
                height={959}
                priority
                className="h-auto w-full rounded-md shadow-2xl ring-1 ring-zinc-900/10"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                The new book from Bill Rice
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
                {BOOK.title}
              </h1>
              <p className="mt-3 text-xl text-zinc-700 dark:text-zinc-300">{BOOK.subtitle}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every advantage you had as a seller just became a commodity. The
                follow-up you spent an hour writing, a machine now writes in
                seconds and sends two thousand times. If what you sold was effort,
                you&apos;re competing with something that never sleeps. So what&apos;s
                left?
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <TrackedOutboundLink
                  href={amazonHref}
                  ctaId="book-amazon-hero"
                  ctaLocation="book-page"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Get it on Amazon Kindle
                </TrackedOutboundLink>
                <a
                  href="#inside"
                  className="text-base font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                >
                  What&apos;s inside ↓
                </a>
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                Kindle edition · {BOOK.printLength} pages · Published {BOOK.datePublishedLabel} by{" "}
                {BOOK.publisher}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The story */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-14 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            The story
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              Marcus Reyes is a software founder who has to become the entire
              revenue engine of his company, or watch it die. Over one year he
              goes from firing twenty-four hundred emails into a void to standing
              in a ballroom where the room came to him.
            </p>
            <p>
              What he finds is that the one thing the machines can&apos;t fake is
              a person who went genuinely deep on something. Not hustle. Not
              volume. Expertise, fed by real curiosity, that builds into an
              audience, a pipeline and, in time, a moat.
            </p>
            <p>
              Each chapter closes with the framework underneath the scene, so the
              story teaches and the method travels with you.
            </p>
          </div>
        </div>
      </section>

      {/* Inside */}
      <section id="inside" className="scroll-mt-24 bg-white py-14 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            What&apos;s inside
          </h2>
          <ul className="mt-6 space-y-3">
            {INSIDE.map((item) => (
              <li key={item} className="flex gap-3 text-lg text-zinc-700 dark:text-zinc-300">
                <span aria-hidden className="mt-1 text-blue-600 dark:text-blue-400">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-zinc-700 dark:text-zinc-300">
            For founders, solo sellers, consultants, and anyone who has been
            handed a number and no headcount.
          </p>
        </div>
      </section>

      {/* Bridge to the site's readers */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-14 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Why it&apos;s here, on a site about working leads
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FOR_LEAD_WORKERS.map((c) => (
              <div
                key={c.heading}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{c.heading}</h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-zinc-700 dark:text-zinc-300">
            Want the aged-lead version of that idea right now? Read{" "}
            <Link
              href="/blog/aged-leads-customer-database-ai-assistant"
              className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
            >
              Aged Leads Aren&apos;t Leads. They&apos;re a Customer Database
            </Link>
            , or get the free{" "}
            <Link
              href="/playbook"
              className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
            >
              Aged Lead Operator&apos;s System
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Author */}
      <section className="bg-white py-14 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            About the author
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            Bill Rice has spent 30+ years in lead generation, fintech marketing
            and sales. He built EquityOnline at Quicken Loans, founded Kaleidico
            in 2005, ran Velocity Lending as owner and operator, and now runs Bill
            Rice Strategy Group and Verified Vector, an AI-first agency with no
            employees. He
            writes the guides and playbooks on Work Aged Leads and is the author
            of The Lead Buyer&apos;s Playbook.{" "}
            <Link
              href="/about/bill-rice"
              className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
            >
              Full bio
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-14 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Questions
          </h2>
          <dl className="mt-6 space-y-6">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="text-lg font-semibold text-zinc-900 dark:text-white">{f.q}</dt>
                <dd className="mt-2 text-zinc-700 dark:text-zinc-300">{f.a}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <TrackedOutboundLink
              href={amazonHref}
              ctaId="book-amazon-footer"
              ctaLocation="book-page"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Get {BOOK.title} on Amazon
            </TrackedOutboundLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <NewsletterSignup
            context="book-page"
            heading="Get Bill's weekly notes on working leads"
            description="Practical strategies for selling on your own: scripts, systems and where AI helps. Free, unsubscribe anytime."
          />
        </div>
      </section>
    </>
  );
}
