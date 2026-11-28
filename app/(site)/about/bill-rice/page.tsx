import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, personPageJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "Bill Rice – Founder & Lead Conversion Expert",
  description:
    "Bill Rice has 30+ years building lead conversion systems across insurance, mortgage, and solar. Founder of Kaleidico (CRO), Bill Rice Strategy Group, and Verified Vector. Marketing director for Aged Lead Store. Author of The Lead Buyer's Playbook.",
  alternates: { canonical: `${baseUrl}/about/bill-rice` },
};

export default function BillRicePage() {
  return (
    <>
      <JsonLd data={personPageJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "About", url: `${baseUrl}/about` },
          { name: "Bill Rice", url: `${baseUrl}/about/bill-rice` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "About", href: "/about" },
              { label: "Bill Rice" },
            ]}
          />

          <header className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Bill Rice
            </h1>
            <p className="mt-2 text-lg text-blue-600 dark:text-blue-400">
              Founder & Lead Conversion Expert
            </p>
          </header>

          <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              Bill Rice has spent 30+ years building lead conversion systems
              that work — across insurance, mortgage, solar, and home
              improvement industries. He&apos;s personally worked millions of
              leads and developed the training frameworks that help sales
              professionals turn aged leads into closed deals at scale.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Background
            </h2>
            <p>
              Bill started his career as a{" "}
              <strong className="text-zinc-900 dark:text-white">
                U.S. Air Force Office of Special Investigations (AFOSI) Special
                Agent and case officer
              </strong>
              , running counterespionage operations, where he developed the
              systematic thinking and process discipline that would later define
              his approach to lead conversion. In 2000 he joined{" "}
              <strong className="text-zinc-900 dark:text-white">
                DeepGreen Bank as Employee #7
              </strong>{" "}
              — one of the first internet-only banks, which grew to about 80
              people running what functionally behaved like a billion-dollar
              bank before its sale to LightYear Capital in 2004. He then moved
              to Quicken Loans (now Rocket Mortgage), initially as COO of the
              Rock Bank project and then as VP of National Home Equity, where
              he built EquityOnline — their first true online lending platform.
            </p>
            <p>
              In 2005 Bill founded{" "}
              <a
                href="https://kaleidico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Kaleidico
              </a>
              {" "}as a lead management software company (he coined &ldquo;lead
              management&rdquo; as an industry category and authored the original
              Wikipedia page). After the 2008 mortgage meltdown destroyed the
              call-center lender client base, he pivoted Kaleidico into the
              demand generation agency it is today. From 2016 to 2018, Bill
              also owned and operated{" "}
              <strong className="text-zinc-900 dark:text-white">
                Velocity Lending
              </strong>
              , a DTC mortgage lender that served as his live proof-of-concept
              for the Kaleidico playbook — and for how aged leads, worked
              correctly, can build a startup lender&apos;s database foundation
              fast.
            </p>
            <p>
              Through that work, Bill discovered a fundamental problem: the
              economics of lead generation are broken for most salespeople.
              Real-time leads cost $15-$60+ each, competition is fierce, and
              most agents burn through their budgets before they can build
              sustainable pipelines.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Aged Lead Expertise
            </h2>
            <p>
              Bill identified aged leads as the solution — consumer records that
              cost 80-95% less than real-time leads, giving salespeople the
              volume they need to build predictable income. But volume alone
              isn&apos;t enough. Bill developed complete systems for working aged
              leads: outreach cadences, scripts, compliance frameworks, and ROI
              tracking methodologies that turn raw data into revenue. At Velocity
              Lending he ran this playbook himself — validating that aged leads,
              handled correctly, can be the operational foundation of a startup
              lender&apos;s growth strategy.
            </p>
            <p>
              As{" "}
              <strong className="text-zinc-900 dark:text-white">
                marketing director for Aged Lead Store
              </strong>{" "}
              (the industry&apos;s most trusted aged lead provider, operating
              since 2001 with an A+ BBB rating), Bill creates the training
              courses, scripts, and content that help thousands of sales
              professionals master the aged lead approach.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Current Work
            </h2>
            <p>
              Bill runs three companies today.{" "}
              <a
                href="https://kaleidico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Kaleidico
              </a>
              , where he serves as CRO following the agency&apos;s acquisition
              and liquidity event (he retained 10% and continues to lead
              business development, sales, and marketing strategy and execution).{" "}
              <a
                href="https://billricestrategy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Bill Rice Strategy Group
              </a>
              , his B2B strategic agency for fintech companies. And{" "}
              <a
                href="https://verifiedvector.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Verified Vector
              </a>
              , his AI-first agency with no employees — just AI agents and
              Bill, delivering strategy, content, presentations, sales, and
              marketing in code. He is the author of{" "}
              <a
                href="https://www.leadbuyerplaybook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                The Lead Buyer&apos;s Playbook
              </a>
              {" "}(2025) and{" "}
              <Link
                href="/book/sales-team-of-one"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Sales Team of One
              </Link>
              {" "}(2026).
            </p>
            <p>
              At Work Aged Leads, Bill writes the guides, playbooks, and
              training content based on his direct experience — not theory. When
              he writes about calling scripts, conversion rates, or outreach
              cadences, it comes from decades of doing it himself — including
              running Velocity Lending as owner and operator from 2016 to 2018.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Connect
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://billrice.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Full Career Profile ↗
                </a>
              </li>
              <li>
                <a
                  href="https://kaleidico.com/bill-rice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Kaleidico ↗
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/@billrice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Medium ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
