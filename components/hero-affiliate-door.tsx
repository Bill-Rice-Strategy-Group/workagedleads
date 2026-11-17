import Link from "next/link";
import { agedLeadLabel } from "@/lib/affiliate";
import { affiliateDestination } from "@/lib/store-front";
import { PromoCodeNote } from "./promo-bar";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

/**
 * The above-the-fold outbound door for commercial pages.
 *
 * WHY THIS EXISTS
 *
 * The 2026-08-18 scoreboard reading (data/loop/ledger.json) separated demand
 * from conversion for the first time. `/providers/aged-lead-store` converted at
 * 43.33% on 90 views and supplied 39 of 69 affiliate clicks; the four biggest
 * `/lead-types/*` pages carried 629 views and converted at ~0.95%.
 *
 * The gap was not CTA *count* — the lead-type pages already carried more
 * affiliate surfaces than the provider page. It was position and destination.
 * The provider page puts an outbound door in the hero
 * (`providers/[slug]/page.tsx`, "Visit Website"); the lead-type heroes offered
 * only two internal links, so a reader at peak intent was routed to another
 * page on this site instead of to the merchant.
 *
 * This component is that missing door, deep-linked to the specific lead type's
 * category rather than the generic catalogue.
 *
 * Intent on a guide page is genuinely lower than on a provider review, so the
 * 43% rate is not the target. The hypothesis under test is 5% — see `nextPick`
 * in the ledger. Measure via `utm_content=hero-door` in
 * `/api/reports/outbound-clicks`, and kill this if it does not move.
 *
 * ITERATION 11 (2026-10-05) — THE DOOR WORKED, THE DESTINATION DID NOT
 *
 * The 2026-08-18 bet above was about door *position*, and on its own terms it
 * won: site-side click rate on the four biggest lead-type pages went 0.95% ->
 * 7.24%. What the store-side scoreboard then showed is that none of those
 * clicks became orders.
 *
 * Store-side GA4 357329146, 2026-09-01 -> 10-05, sessionMedium=affiliate:
 *
 *   lead-type / hero-door      32 sessions   1 add-to-cart   0 orders   $0.00
 *   providers-hub / hero-door  22 sessions  15 add-to-carts  5 orders  $545.00
 *
 * Same component, same window, and the lead-type instance carries MORE
 * sessions than the one earning the money. So the gap is not the component and
 * not the placement. It is where each one points.
 *
 * Splitting `lead-type` sessions by the page they landed on isolates it: of the
 * ~12 that landed on one of the partner's marketing pages — the destinations
 * `storeCategoryPath` returns — zero reached a cart. The campaign's single
 * add-to-cart came from a session landing on /customers/login, i.e. an
 * existing account holder, which is the returning-user artifact already
 * documented for the retired site's header door rather than a reader this door
 * converted.
 *
 * A page of prose has no cart on it. The partner's storefront pages do, along
 * with state filters and live per-lead pricing, and the one surface on this
 * whole property that reliably produces orders — the weekly newsletter, 13
 * sessions -> 3 orders -> $2,224.40 in the same window — has deep-linked past
 * the marketing pages into that storefront since 2026-08-27.
 *
 * This component now does the same wherever the partner stocks the vertical.
 * See `lib/store-front.ts` for the segment map, the card-grid provenance, and
 * the body-diff verification.
 *
 * Unchanged on purpose: a caller that passes no `leadType` (the lead-types hub
 * and the providers hub) resolves no segment and keeps the exact URL it had.
 * The providers hub is the door that earns, so it is deliberately untouched —
 * and a reader who has not named a vertical is better served by the catalogue's
 * card grid, which shows every vertical with its price, than by one segment
 * picked for them.
 */
interface HeroAffiliateDoorProps {
  /**
   * A Sanity `leadType.title` ("Mortgage Leads") or a slug — `storeCategoryPath`
   * accepts both. Omit for the hub page, which lands on the full catalogue.
   */
  leadType?: string;
  campaign: string;
  /**
   * The `utm_content` base. A `-store` suffix is appended automatically when
   * the vertical resolves to a storefront segment, so `hero-door` becomes
   * `hero-door-store` and the destination change stays readable in the
   * store-side scoreboard. Pass the base, never the suffixed value.
   */
  content?: string;
  /** Secondary links rendered beside the door, in order. */
  secondary?: { label: string; href: string }[];
  /**
   * Which background this sits on. `dark` is the gradient hero on
   * `/lead-types/[slug]`; `light` is the plain hub header. Getting this wrong
   * renders a white button on a white background, so it is explicit rather
   * than inferred.
   */
  tone?: "dark" | "light";
}

const TONE = {
  dark: {
    primary:
      "bg-white text-blue-900 shadow-lg hover:bg-blue-50",
    secondary:
      "border-2 border-white/30 text-white hover:bg-white/10",
    disclosure: "text-zinc-400",
    disclosureLink: "underline hover:text-zinc-200",
  },
  light: {
    primary:
      "bg-blue-600 text-white shadow-lg hover:bg-blue-700",
    // border-zinc-400 clears the 3:1 non-text contrast bar on white; the
    // zinc-300 used for decorative rules elsewhere does not.
    secondary:
      "border-2 border-zinc-400 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800",
    disclosure: "text-zinc-500 dark:text-zinc-400",
    disclosureLink: "underline hover:text-zinc-800 dark:hover:text-zinc-200",
  },
} as const;

export function HeroAffiliateDoor({
  leadType,
  campaign,
  content = "hero-door",
  secondary = [],
  tone = "dark",
}: HeroAffiliateDoorProps) {
  const t = TONE[tone];

  /*
    Destination precedence: storefront segment -> marketing buy page -> full
    catalogue. Every step is strictly closer to a cart, and each falls through
    only when the one above it does not exist for this vertical.

    Legal, SSDI and MVA land on the middle rung by design — `/legal/leads` is a
    verified 404 and the partner sells all legal intake from the marketing page,
    so `storeCategoryPath` is the best available answer there, not a fallback
    that failed.
  */
  const destination = affiliateDestination({ leadType, campaign, content });
  const segment = destination.segment;

  /*
    `-store` suffix so the destination change is legible in the scoreboard
    instead of averaging into the marketing-page history under the same tag.
    This is the same move iteration 4 made when it split `header` from
    `header-mobile`: a bet you cannot separate from the bet it replaced is a bet
    you cannot read afterwards. Two buckets, not one per vertical — the campaign
    turns ~32 sessions a month, and a tag per vertical would make every future
    reading underpowered by construction.
  */
  const resolvedContent = destination.content;

  const href = destination.href;

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <TrackedAffiliateLink
          href={href}
          ctaId={`hero-door-${campaign}-${resolvedContent}`}
          ctaLocation="hero-affiliate-door"
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-center font-semibold transition-colors ${t.primary}`}
        >
          {/*
            "Shop" rather than "Browse" when the link goes to the storefront.
            The verb is doing a job, not decorating: the reader is one click from
            priced, filterable inventory with a cart on it, and a label that
            promises browsing sets them up to bounce off a buying screen. Where
            the link still goes to a marketing page, "Browse" stays accurate and
            is left alone.
          */}
          {segment
            ? `Shop ${agedLeadLabel(leadType)}`
            : `Browse ${agedLeadLabel(leadType)} at Aged Lead Store`}
          <svg
            className="h-3.5 w-3.5"
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

        {/* Secondary paths keep their place — the internal compare and pricing
            routes are how this site earns the trust that makes the door work.
            They lose the primary styling, not the position. */}
        {secondary.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-8 py-3 text-center font-semibold transition-colors ${t.secondary}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <PromoCodeNote className={`mt-4 max-w-2xl ${t.disclosure}`} />

      {/*
        Tell the reader what is on the other side of the click. The marketing
        pages this used to point at looked like more of the page they were
        already on, so the click cost them nothing to make and nothing to
        abandon. A buying screen is a different kind of page, and saying so is
        both the honest framing and the one that sets the right expectation.
        Only rendered for storefront destinations — it would be false on a
        marketing page, which has no filters and no cart.
      */}
      {segment && (
        <p className={`mt-4 max-w-2xl text-sm ${t.disclosure}`}>
          Opens the Aged Lead Store catalog for {agedLeadLabel(leadType)} — filter
          by state and see current pricing before you buy.
        </p>
      )}

      <p
        className={`${segment ? "mt-2" : "mt-4"} max-w-2xl text-xs ${t.disclosure}`}
      >
        Affiliate link — we may earn a commission at no cost to you, and it never
        affects our ratings or recommendations.{" "}
        <Link href="/affiliate-disclosure" className={t.disclosureLink}>
          Disclosure
        </Link>
      </p>
    </div>
  );
}
