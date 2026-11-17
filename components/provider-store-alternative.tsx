import Link from "next/link";
import { affiliateUrl, storeCategoryPath } from "@/lib/affiliate";
import { providerStoreComparison } from "@/lib/provider-store-match";
import { PromoCodeNote } from "./promo-bar";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

/**
 * The same-page alternative on a competitor's provider profile.
 *
 * WHY THIS EXISTS
 *
 * `/providers/{slug}` is the only page on this site that links out to a provider
 * that pays us nothing, and it was the whole of the leak: in the 30 days to
 * 2026-10-05 GA4 recorded 202 outbound clicks, 157 to the partner and 42 to
 * non-paying providers, and every one of those 42 carried
 * `utm_campaign=provider-{slug}` — the hero "Visit Website" button, the single
 * call site of `providerWebsiteUrl`. The reader at peak purchase intent was
 * offered one destination, and it was the one that pays nothing.
 *
 * WHAT THIS DELIBERATELY IS NOT
 *
 * The competitor's link keeps its primary styling and its position in the hero.
 * Nothing is removed, demoted, or buried. The independence of these reviews is
 * the only reason the directory is worth reading, and it is the premise of
 * /methodology; trading it for a few clicks would cost more than the clicks are
 * worth. What changes is that the alternative now exists at the decision point
 * instead of six screens below it.
 *
 * Everything it claims is checkable on this site: the two scores come from the
 * published six-dimension ratings, the "highest in the directory" line is
 * asserted against the data in lib/provider-store-match.test.ts rather than
 * written in by hand, and a vertical is only linked when the partner has a real
 * buy page for it. Where there is no catalogue overlap — Lead Tycoons and
 * Synergy Direct Solution sell only MCA leads — it says so and offers no
 * affiliate link at all.
 *
 * Measure it with `utm_content=store-alternative` and
 * `utm_campaign=provider-alt-{slug}` in `/api/reports/outbound-clicks`.
 */

interface ProviderStoreAlternativeProps {
  providerSlug: string;
  providerName: string;
  providerRating: number;
}

export function ProviderStoreAlternative({
  providerSlug,
  providerName,
  providerRating,
}: ProviderStoreAlternativeProps) {
  const c = providerStoreComparison(providerSlug);
  if (!c) return null;

  const totalVerticals = c.stocked.length + c.unstockedNames.length;
  const hasOverlap = c.stocked.length > 0;

  return (
    <aside className="mt-8 max-w-2xl rounded-xl border border-white/15 bg-white/5 p-5">
      <h2 className="flex items-start gap-2 text-sm font-semibold text-white">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
        Compare with {c.affiliateName}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        {c.affiliateName} scores {c.affiliateRating}/10 to {providerName}&rsquo;s{" "}
        {providerRating}/10 on the same six dimensions
        {c.affiliateIsTopRated ? ", the highest in this directory" : ""}.{" "}
        {hasOverlap ? (
          // "1 of the 1 verticals" is what the ratio reads as for a
          // single-vertical provider like LeadPoint, and several providers
          // (iLeads, Brokers Data) are a full overlap too. Both get prose.
          <>
            {c.unstockedNames.length === 0
              ? `It carries ${
                  totalVerticals === 1 ? "the same vertical" : "every vertical"
                } ${providerName} sells:`
              : `It carries ${c.stocked.length} of the ${totalVerticals} verticals ${providerName} sells:`}
          </>
        ) : (
          <>
            It does not sell {formatList(c.unstockedNames)} leads, so there is no
            overlap on inventory — {providerName} covers something{" "}
            {c.affiliateName} does not.
          </>
        )}
      </p>

      {hasOverlap && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {c.stocked.map((v) => (
            <li key={v.verticalSlug}>
              <TrackedAffiliateLink
                href={affiliateUrl({
                  path: storeCategoryPath(v.leadTypeKey),
                  campaign: `provider-alt-${providerSlug}`,
                  content: "store-alternative",
                })}
                ctaId={`store-alternative-${providerSlug}-${v.verticalSlug}`}
                ctaLocation="provider-profile-store-alternative"
                // Taller on phones so the tap target clears the thumb; the
                // desktop pill stays compact.
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:border-white/40 hover:bg-white/20 sm:py-1.5"
              >
                {v.verticalName} leads
                <svg
                  className="h-3 w-3 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </TrackedAffiliateLink>
            </li>
          ))}
        </ul>
      )}

      {hasOverlap && <PromoCodeNote className="mt-3 text-blue-200" />}

      {/* The head-to-head is internal and stays internal. It is the honest
          version of "keep the reader on-site first": a real comparison scored
          on the published methodology, not an interstitial in the way of the
          link they asked for. */}
      <Link
        href={c.comparePath}
        // `inline-block`, not `inline-flex`: when the label wraps on a phone a
        // flex arrow floats off to the right of the block instead of trailing
        // the last word.
        className="mt-4 inline-block text-sm font-semibold text-blue-300 underline-offset-2 hover:text-blue-200 hover:underline"
      >
        {/* "See the full The Leads Warehouse vs…" is what the obvious phrasing
            produces for providers whose name starts with an article. */}
        See the head-to-head: {providerName} vs {c.affiliateName}{" "}
        <span aria-hidden="true">&rarr;</span>
      </Link>

      {hasOverlap && (
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Affiliate links — we may earn a commission at no cost to you, and it
          never affects our ratings or recommendations.{" "}
          <Link
            href="/affiliate-disclosure"
            className="underline hover:text-zinc-200"
          >
            Disclosure
          </Link>
        </p>
      )}
    </aside>
  );
}

/** "A", "A and B", "A, B and C" — Oxford-comma-free, US English. */
function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
