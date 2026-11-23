import type { Metadata } from "next";
import { PROVIDERS } from "@/data/providers";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Full disclosure of affiliate relationships on Work Aged Leads. How we earn revenue, how it does and does not influence our editorial content.",
  alternates: { canonical: `${baseUrl}/affiliate-disclosure` },
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          {
            name: "Affiliate Disclosure",
            url: `${baseUrl}/affiliate-disclosure`,
          },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Affiliate Disclosure
            </h1>
            <p className="mt-4 text-sm text-zinc-500">
              Last updated: April 4, 2026
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p>
              Transparency matters. Here is a complete and honest disclosure of
              how Work Aged Leads earns revenue and how those relationships do
              and do not affect our content.
            </p>

            <h2>How We Make Money</h2>
            <p>
              Work Aged Leads earns revenue through affiliate partnerships with
              lead providers. When you click a link to a provider on our site and
              make a purchase, we may earn a referral commission at no additional
              cost to you. This revenue funds the free tools, training content,
              and independent research on this site.
            </p>

            <h2>Our Relationship with Aged Lead Store</h2>
            <p>
              Full disclosure: Bill Rice, the founder of this site, serves as
              the marketing director for{" "}
              <strong>AgedLeadStore.com</strong>. Aged Lead Store is one of the
              {PROVIDERS.length} providers reviewed in our{" "}
              <Link href="/providers">provider directory</Link>. This
              relationship is always disclosed on relevant pages.
            </p>
            <p>
              Despite this relationship, Aged Lead Store is rated using the same{" "}
              <Link href="/methodology">published methodology</Link> as every
              other provider. We publish honest assessments including
              limitations, and we do not guarantee higher ratings for affiliated
              providers.
            </p>

            <h2>What Affiliate Relationships Do NOT Influence</h2>
            <ul>
              <li>
                <strong>Provider ratings and scores</strong> &mdash; ratings are
                based on our six-dimension methodology, not affiliate status
              </li>
              <li>
                <strong>Editorial recommendations</strong> &mdash; our
                &quot;best for&quot; and &quot;not ideal for&quot; assessments
                are based on genuine analysis
              </li>
              <li>
                <strong>Pricing benchmarks</strong> &mdash; our Lead Price Index
                is based on market data, not affiliate commission rates
              </li>
              <li>
                <strong>Content topics and coverage</strong> &mdash; we write
                about what helps readers, not what generates the most affiliate
                clicks
              </li>
            </ul>

            <h2>How Affiliate Links Are Identified</h2>
            <p>
              Affiliate links on this site are identified in several ways:
            </p>
            <ul>
              <li>
                Affiliate links use{" "}
                <code>rel=&quot;nofollow sponsored noopener noreferrer&quot;</code>{" "}
                attributes in the HTML
              </li>
              <li>
                Affiliate links include UTM tracking parameters
                (utm_source=workagedleads, utm_medium=affiliate) so the
                referring site can be credited for the visit
              </li>
              <li>
                A disclosure notice appears above the footer on every page of
                this site
              </li>
              <li>
                Individual provider pages note when an affiliate relationship
                exists
              </li>
            </ul>

            <h2>FTC Compliance</h2>
            <p>
              This disclosure is made in accordance with the Federal Trade
              Commission&apos;s guidelines on endorsements and testimonials (16
              CFR Part 255). We believe in proactive transparency &mdash; you
              should always know when we have a financial relationship with a
              company we mention.
            </p>

            <h2>Our Commitment</h2>
            <p>
              We would rather lose an affiliate commission than your trust. If a
              provider is not good, we will say so regardless of whether they are
              an affiliate partner. If a non-affiliate provider is the best
              option for a given use case, we will recommend them.
            </p>
            <p>
              Our reputation depends on giving you honest, useful information.
              We take that seriously.
            </p>

            <h2>Questions</h2>
            <p>
              If you have questions about our affiliate relationships or believe
              a disclosure is missing, use the{" "}
              <Link href="/contact">contact form</Link> or email{" "}
              <a href="mailto:bill@billricestrategy.com">
                bill@billricestrategy.com
              </a>
              . Both reach Bill directly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
