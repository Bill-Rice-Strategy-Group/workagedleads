import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageDataQuery } from "@/sanity/lib/queries";
import { LeadTypeCard } from "@/components/lead-type-card";
import { PostCard } from "@/components/post-card";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TrustStrip } from "@/components/trust-strip";
import { NextStepRouter } from "@/components/next-step-router";
import { JsonLd, websiteJsonLd, organizationJsonLd } from "@/components/json-ld";

const LEAD_TYPE_DEFAULTS = [
  {
    icon: "🏠",
    title: "Mortgage Leads",
    slug: "mortgage-leads",
    shortDescription:
      "Connect with homebuyers and refinancers who expressed interest in mortgage products. High-intent data at a fraction of real-time cost.",
  },
  {
    icon: "🛡️",
    title: "Insurance Leads",
    slug: "insurance-leads",
    shortDescription:
      "Reach consumers who previously requested quotes for auto, home, health, or life insurance products.",
  },
  {
    icon: "⚰️",
    title: "Final Expense Leads",
    slug: "final-expense-leads",
    shortDescription:
      "Access aged final expense and burial insurance leads — a proven market with high close rates using the right approach.",
  },
  {
    icon: "📈",
    title: "IUL Leads",
    slug: "iul-leads",
    shortDescription:
      "Indexed Universal Life leads from consumers who explored cash-value life insurance and wealth-building strategies.",
  },
  {
    icon: "⚖️",
    title: "SSDI Leads",
    slug: "ssdi-leads",
    shortDescription:
      "Social Security Disability Insurance leads from individuals who sought assistance with their disability claims.",
  },
  {
    icon: "🚗",
    title: "MVA Leads",
    slug: "mva-leads",
    shortDescription:
      "Motor Vehicle Accident leads for personal injury attorneys and legal services professionals.",
  },
  {
    icon: "☀️",
    title: "Solar Leads",
    slug: "solar-leads",
    shortDescription:
      "Homeowners who expressed interest in solar panel installation and renewable energy savings.",
  },
  {
    icon: "🏥",
    title: "Medicare Leads",
    slug: "medicare-leads",
    shortDescription:
      "Seniors approaching or in Medicare eligibility who explored supplement and advantage plan options.",
  },
];

export default async function HomePage() {
  const data = await sanityFetch(homepageDataQuery);

  const leadTypes =
    data?.leadTypes && data.leadTypes.length > 0
      ? data.leadTypes
      : LEAD_TYPE_DEFAULTS;
  const recentPosts = data?.recentPosts || [];
  const featuredPlaybooks = data?.featuredPlaybooks || [];

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              You Bought the Leads.{" "}
              <span className="text-blue-400">Now Work Them.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Aged leads don&apos;t fail because the data is old. They fail
              because they get worked like fresh leads. Scripts, cadences and
              systems built for records that are 30 to 365 days old — plus what
              they should cost and who sells them.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/playbook"
                className="rounded-lg bg-blue-600 px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                Get the Free Playbook
              </Link>
              <Link
                href="/providers"
                className="rounded-lg border border-zinc-600 px-8 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Compare Lead Providers
              </Link>
              <Link
                href="/price-index"
                className="rounded-lg border border-zinc-600 px-8 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Lead Price Index
              </Link>
            </div>

            {/*
              KILL RULE APPLIED 2026-10-05 — the homepage outbound door is gone.
              Iteration 6, data/loop/ledger.json.

              Ledger rule: "Kill if / does not clear 2% by 2026-09-23. That is 4x
              today and still below the providers hub. If a door on the
              highest-traffic page cannot clear 2%, the door pattern has reached
              its limit on low-intent surfaces and the next iteration must buy
              intent rather than add placements."

              WHAT THE RULE'S OWN METRIC SHOWS: nothing, and that is worth
              recording. Door-clicks ÷ sessions on / is not computable today.
              The numerator is not door-isolated — / carries three affiliate
              surfaces (this door, the bottom CtaBanner, and the site header) and
              the outbound-clicks report attributes 7 affiliate clicks to the
              page as a whole; GA4 truncates linkUrl at 100 chars, so its
              topLinks rows are cut before utm_campaign and cannot be split. The
              denominator available is screenPageViews (459), not sessions, and
              sessions-per-page needs site-side GA4 528489903, which 403s.

              WHAT DECIDED IT: store-side GA4 357329146, door-isolated by
              utm_content, 2026-09-01→10-05 — homepage-hero/hero-door produced
              1 session, 0 transactions, $0.00. Against up to 7 clicks measured
              leaving the page, 1 store session says most of those clicks were
              the header or the banner, not this door. No plausible denominator
              rescues ~1 click in five weeks against a 2% bar.

              THE CONSEQUENCE THE RULE NAMED NOW BINDS. Across the same window
              every low-intent door earned exactly $0 — homepage 1 session,
              both calculator doors 0 sessions, header-nav 40 sessions. All 9
              orders and all $3,269.40 came from high-intent surfaces: the
              providers hub door (22 sessions → 5 orders → $545) and the weekly
              newsletter (13 sessions → 3 orders → $2,224.40). So stop adding
              placements; buy or match intent instead.

              NOT REMOVED: the bottom CtaBanner (utm_campaign=cta-banner), which
              this rule does not cover, and HeroAffiliateDoor itself, which earns
              on /providers and /lead-types. Only the homepage instance is gone.

              "Get the Free Playbook" above is untouched — it feeds the lifecycle
              program, and that list is a compounding asset.
            */}

            {/* Trust signals — real E-E-A-T, no fabricated counts */}
            <TrustStrip className="mt-10" />
          </div>

          {/* Stats — about aged leads as a strategy, NOT about us as a company */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "10-50x", label: "Lower Cost Per Lead" },
              { value: "15+", label: "Verticals Covered" },
              { value: "15+", label: "Providers Reviewed" },
              { value: "Free", label: "Tools & Calculators" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Direct answer for the "aged leads" query (GSC avg position 12.7,
        2026-11). The H1 is a brand line, so nothing near the top of the
        homepage actually said what an aged lead is. A short definition, then
        links to the pages that carry the detail.
      */}
      <section className="border-b border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            What are aged leads?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Aged leads are real consumer inquiries — quote requests, rate
            checks, form fills — resold after the first buyers have had their
            turn, usually 30 to 365 days after the person asked. They cost a
            fraction of a real-time lead because the race to call first is
            over. The trade-off is that they have to be worked differently:
            more patience, a longer cadence, and a script that acknowledges the
            time that has passed.
          </p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            See current pricing in the{" "}
            <Link href="/price-index" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              aged lead price index
            </Link>
            , browse{" "}
            <Link href="/lead-types" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              aged leads by industry
            </Link>
            , or compare{" "}
            <Link href="/providers" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              aged lead providers
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Flagship Magnet Strip */}
      <section className="border-b border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border-2 border-blue-600 bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-900 p-8 text-white shadow-xl sm:p-10">
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Free · Playbook + Workbook + 10-day Email Course
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  The Aged Lead Operator&apos;s System
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
                  The complete operator&apos;s manual for turning aged leads into closed deals — scripts, unit economics, 14-day cadence, infinity nurture, and current 2026 TCPA compliance. Tuned to your vertical.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-col">
                <Link
                  href="/playbook/mortgage"
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-medium backdrop-blur transition hover:bg-white/20 md:flex-none"
                >
                  🏠 Mortgage →
                </Link>
                <Link
                  href="/playbook/insurance"
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-medium backdrop-blur transition hover:bg-white/20 md:flex-none"
                >
                  🛡️ Insurance →
                </Link>
                <Link
                  href="/playbook/home-services"
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-medium backdrop-blur transition hover:bg-white/20 md:flex-none"
                >
                  🔨 Home Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Types Grid */}
      <section className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Aged Leads for Every Industry
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              We carry aged leads across the most popular verticals. Click any
              lead type to learn strategies, see playbooks, and start buying.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadTypes.map(
              (lt: {
                _id?: string;
                title: string;
                slug: string | { current: string };
                shortDescription: string;
                icon?: string;
              }) => (
                <LeadTypeCard
                  key={lt._id || lt.title}
                  title={lt.title}
                  slug={
                    typeof lt.slug === "string" ? lt.slug : lt.slug.current
                  }
                  shortDescription={lt.shortDescription}
                  icon={lt.icon}
                />
              )
            )}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/lead-types"
              className="text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all lead types &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              How Aged Leads Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Aged leads are consumer records from people who previously
              expressed interest in a product or service. Here&apos;s why they work.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Massive Volume, Low Cost",
                description:
                  "Get 500–1,000+ records for the price of 10–15 real-time leads. Fill your pipeline without blowing your budget.",
              },
              {
                step: "2",
                title: "Real Intent, Real Context",
                description:
                  "These are real people who did express interest in your service 30–90+ days ago. You know their name, contact info, and what they needed.",
              },
              {
                step: "3",
                title: "Higher Profit Margins",
                description:
                  "Lower cost per lead means you only need a 1–2% conversion rate to dramatically outperform expensive real-time leads.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Internal routing, not a door — Click Loop iteration P4, 2026-10-05.

        Placed directly after "How Aged Leads Work" on purpose. A reader who has
        just absorbed why aged data works has exactly three open questions
        left — which vertical, what it costs, who sells it — and this is where
        they surface naturally. The homepage audience has not declared a
        vertical, so every destination here is a hub that lets them choose; none
        of them picks a vertical or a seller on their behalf.

        No affiliate or store link belongs in this block. The homepage door was
        killed today on measured evidence (ledger kills[], iteration 6), and the
        kill's own stated consequence is to buy or match intent rather than add
        placements. These are first-party paths only.
      */}
      <NextStepRouter
        tone="plain"
        heading="Three decisions stand between this and your first order"
        intro="Aged data only pays when the vertical, the price and the seller line up. Each of these covers one of them, and each lets you pick for yourself rather than taking our word for it."
        items={[
          {
            href: "/lead-types",
            label: "Lead types by vertical",
            description:
              "Buying guides for mortgage, Medicare, final expense, life, solar, legal, home improvement and more — what each file actually contains, who it suits, and how it gets worked.",
            icon: "verticals",
            meta: "Start here if your vertical is still open",
          },
          {
            href: "/price-index",
            label: "Lead Price Index",
            description:
              "Quarterly benchmarks for aged, real-time and live-transfer leads across fifteen verticals, so you arrive at a quote with a reference point instead of a guess.",
            icon: "pricing",
          },
          {
            href: "/providers",
            label: "Provider comparison",
            description:
              "Independent six-dimension ratings of the sellers we have reviewed, with a published methodology and a verification date on every one.",
            icon: "providers",
          },
        ]}
      />

      {/* Pipeline Calculator — featured tool */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-zinc-950 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Most-used tool
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  How many leads do you actually need?
                </h2>
                <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
                  At a 1–2% close rate, your pipeline math decides whether aged
                  leads pay off. The Pipeline Volume Calculator turns your income
                  goal, close rate, and average deal size into the exact lead
                  volume to buy — in seconds, no sign-up.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href="/calculators/pipeline-calculator"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Run your pipeline numbers
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/calculators"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    See all 5 free calculators &rarr;
                  </Link>
                </div>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <svg
                  className="h-32 w-32 text-blue-600/80 dark:text-blue-400/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.25}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup variant="banner" context="homepage" />

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="bg-white py-20 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  Latest from the Blog
                </h2>
                <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                  Tips, strategies, and insights for sales professionals.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:block"
              >
                View all posts &rarr;
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts
                .slice(0, 3)
                .map(
                  (post: {
                    _id: string;
                    title: string;
                    slug: { current: string };
                    excerpt: string;
                    mainImage?: { asset?: { _ref: string }; alt?: string };
                    publishedAt?: string;
                    author?: { name: string };
                  }) => (
                    <PostCard
                      key={post._id}
                      title={post.title}
                      slug={post.slug.current}
                      excerpt={post.excerpt}
                      mainImage={post.mainImage}
                      publishedAt={post.publishedAt}
                      author={post.author}
                    />
                  )
                )}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="text-base font-semibold text-blue-600"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Playbooks */}
      {featuredPlaybooks.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  Sales Playbooks
                </h2>
                <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                  Step-by-step guides to master aged lead prospecting.
                </p>
              </div>
              <Link
                href="/playbook"
                className="hidden text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:block"
              >
                Get the Free Playbook &rarr;
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlaybooks.map(
                (pb: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  difficulty?: string;
                  estimatedTime?: string;
                }) => (
                  <PlaybookCard
                    key={pb._id}
                    title={pb.title}
                    slug={pb.slug.current}
                    excerpt={pb.excerpt}
                    mainImage={pb.mainImage}
                    difficulty={pb.difficulty}
                    estimatedTime={pb.estimatedTime}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CtaBanner />
    </>
  );
}
