import Link from "next/link";
import { agedLeadLabel, partnerSells, providerCompareHref } from "@/lib/affiliate";
import { affiliateDestination } from "@/lib/store-front";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

/**
 * The single in-body affiliate line on a commercial page.
 *
 * ITERATION 11 (2026-10-05) — DESTINATION PARITY WITH THE HERO DOOR
 *
 * `HeroAffiliateDoor` moved to the partner's storefront wherever the vertical
 * is stocked, because the marketing pages this used to point at measured ~25
 * sessions and ZERO add-to-carts across two doors while the newsletter — which
 * has deep-linked past them since 2026-08-27 — is the only surface on this
 * property that produces orders. See `lib/store-front.ts` for the segment map,
 * the card-grid provenance and the body-diff verification.
 *
 * On `/lead-types/[slug]` this component renders on the SAME page as that hero
 * door. Leaving it pointed at the marketing page would put two doors on one
 * page with two different destinations, which makes the iteration-11 reading on
 * 2026-11-09 unattributable: a reader who takes the marketing door and bounces
 * is a lost order the storefront bet gets blamed for. So the precedence here is
 * now identical to the hero door's, and deliberately copied from it rather than
 * re-derived.
 *
 * Unchanged on purpose: a caller that passes no `leadType` resolves no segment
 * and keeps the exact URL and label it had.
 */
interface InlineTextCtaProps {
  campaign?: string;
  /**
   * A Sanity `leadType.title` ("Mortgage Leads") or a slug. Both work — see
   * `storeCategoryPath`. Omit it and the CTA points at the full catalogue.
   */
  leadType?: string;
  /**
   * The `utm_content` base. A `-store` suffix is appended automatically when the
   * vertical resolves to a storefront segment, so the destination change stays
   * readable in the store-side scoreboard instead of averaging into the
   * marketing-page history under the same tag. Pass the base, never the
   * suffixed value. Same convention as `HeroAffiliateDoor`.
   */
  content?: string;
  affiliate?: boolean;
}

export function InlineTextCta({
  campaign = "inline-cta",
  leadType,
  content = "inline-text",
  affiliate = true,
}: InlineTextCtaProps) {
  const verticalLabel = agedLeadLabel(leadType);

  // Not sold by the partner (legal/MVA/SSDI since 2026-11-23): no store link.
  const stocked = partnerSells(leadType);
  if (!affiliate || !stocked) {
    return (
      <p className="mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-blue-950/30 dark:text-zinc-300">
        <strong className="text-zinc-900 dark:text-white">
          Looking for {verticalLabel}?
        </strong>{" "}
        <Link
          href={stocked ? "/providers" : providerCompareHref(leadType)}
          className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
        >
          {stocked ? "Compare top providers in our directory" : "Compare the providers that sell them"}
        </Link>
        {stocked
          ? " — thousands of exclusive and shared leads at a fraction of real-time cost."
          : " — independently rated, with pricing and minimums side by side."}
      </p>
    );
  }

  /*
    Destination precedence: storefront segment -> marketing buy page -> full
    catalogue. Each step is strictly closer to a cart, and each falls through
    only when the one above it does not exist for this vertical. Legal, SSDI and
    MVA land on the middle rung by design — `/legal/leads` is a verified 404 and
    the partner sells all legal intake from the marketing page.
  */
  const destination = affiliateDestination({ leadType, campaign, content });
  const segment = destination.segment;
  const resolvedContent = destination.content;
  const href = destination.href;

  /*
    "Shop" rather than "Browse" when the link lands on the storefront: the
    reader is one click from priced, filterable inventory with a cart on it, and
    a label promising browsing sets them up to bounce off a buying screen. Where
    the link still goes to a marketing page, "Browse" stays accurate.
  */
  const linkText = segment
    ? `Shop ${verticalLabel}`
    : `Browse ${verticalLabel} at Aged Lead Store`;

  return (
    <div className="mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 dark:bg-blue-950/30">
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <strong className="text-zinc-900 dark:text-white">
          Looking for {verticalLabel}?
        </strong>{" "}
        <TrackedAffiliateLink
          href={href}
          ctaId={`inline-cta-${campaign}-${resolvedContent}`}
          ctaLocation="inline-text-cta"
          className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
        >
          {linkText}
        </TrackedAffiliateLink>{" "}
        {/*
          Tell the reader what is on the other side of the click. The marketing
          pages this used to point at looked like more of the page they were
          already on, so the click cost nothing to make and nothing to abandon.
          A buying screen is a different kind of page, and saying so is both the
          honest framing and the one that sets the right expectation. Only for
          storefront destinations — it would be false of a marketing page, which
          has no filters and no cart.
        */}
        {segment
          ? "— filter by state and see current pricing before you buy."
          : "— exclusive and shared leads at a fraction of real-time cost, with verified, hygiene-screened contact data."}{" "}
        {/* The alternatives keep their place. The directory link is why this
            page is worth reading, and it is not moved or demoted to make room
            for the disclosed affiliate option. */}
        <Link
          href="/providers"
          className="text-zinc-600 underline decoration-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Or compare other providers
        </Link>
        .
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        Affiliate link — we may earn a commission at no cost to you, and it never
        affects our ratings or recommendations.{" "}
        <Link
          href="/affiliate-disclosure"
          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Disclosure
        </Link>
      </p>
    </div>
  );
}
