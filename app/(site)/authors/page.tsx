import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PostCard } from "@/components/post-card";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CtaBanner } from "@/components/cta-banner";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Authors — Work Aged Leads",
  description:
    "Meet the experts behind Work Aged Leads. Bill Rice brings 30+ years of lead generation and fintech marketing experience to every article, playbook, and tool.",
  alternates: { canonical: `${baseUrl}/authors` },
};

const authorPostsQuery = `*[_type == "post" && author->slug.current == "bill-rice"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  author->{name, slug, image}
}`;

const authorPlaybooksQuery = `*[_type == "playbook" && author->slug.current == "bill-rice"] | order(publishedAt desc) {
  _id,
  title,
  slug
}`;

export default async function AuthorsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, playbooks]: [any[], any[]] = await Promise.all([
    sanityFetch<{ _id: string; title: string; slug: { current: string }; excerpt: string; mainImage?: { asset?: { _ref: string }; alt?: string }; publishedAt?: string; author?: { name: string } }[]>(authorPostsQuery).then((r) => r || []),
    sanityFetch<{ _id: string; title: string; slug: { current: string } }[]>(authorPlaybooksQuery).then((r) => r || []),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Authors", url: `${baseUrl}/authors` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Authors" }]} />

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Authors
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              The experts behind the training, tools, and research on Aged Lead
              Sales.
            </p>
          </div>

          {/* Bill Rice Author Card */}
          <div className="mb-16 rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Bill Rice
                </h2>
                <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  Founder &amp; Lead Conversion Expert
                </p>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                  30+ years in lead generation and fintech marketing. Employee
                  #7 at DeepGreen Bank; built EquityOnline at Quicken Loans.
                  Founded Kaleidico in 2005 as a lead management software
                  company and coined &ldquo;lead management&rdquo; as an
                  industry category — built icoSales, the first intelligent
                  lead scoring and distribution platform for mortgage lead
                  buyers. Owned and operated Velocity Lending (DTC mortgage
                  lender, 2016-2018). Has personally worked millions of leads
                  across insurance, mortgage, solar, and home improvement.
                  Author of The Lead Buyer&apos;s Playbook (2025) and{" "}
                  <Link href="/book/sales-team-of-one" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
                    Sales Team of One
                  </Link>{" "}
                  (2026).
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {posts.length} articles
                  </span>
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {playbooks.length} playbooks
                  </span>
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    USAFA &apos;92
                  </span>
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    MBA Marketing
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/about/bill-rice"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Full Bio
                  </Link>
                  <a
                    href="https://www.linkedin.com/in/billrice/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://billricestrategy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    BillRiceStrategy.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          {posts.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                Articles by Bill Rice
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 9).map(
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
              {posts.length > 9 && (
                <div className="mt-8 text-center">
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    View all {posts.length} articles &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
