import Link from "next/link";
import { agedLeadLabel, partnerSells, providerCompareHref } from "@/lib/affiliate";
import { affiliateDestination } from "@/lib/store-front";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";
import { PromoCodeNote } from "./promo-bar";

/**
 * The sitewide bottom CTA, plus a `compact` in-body variant.
 *
 * ITERATION 11 (2026-10-05) — DESTINATION PARITY WITH THE HERO DOOR
 *
 * `HeroAffiliateDoor` moved to the partner's storefront wherever the vertical is
 * stocked: across two doors, ~25 sessions landed on the partner's MARKETING
 * pages and produced zero add-to-carts, while the weekly newsletter — which has
 * deep-linked past those pages since 2026-08-27 — is the only surface on this
 * property that reliably produces orders. A page of prose has no cart on it.
 * See `lib/store-front.ts` for the segment map, the card-grid provenance and the
 * body-diff verification.
 *
 * This banner renders on the same `/lead-types/[slug]` pages as that hero door.
 * Two doors on one page pointing at two different destinations makes the
 * iteration-11 reading on 2026-11-09 unattributable, so when this banner is
 * given a `leadType` it resolves the SAME precedence, copied from the hero door
 * rather than re-derived.
 */
interface CtaBannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  campaign?: string;
  variant?: "default" | "compact";
  affiliate?: boolean;
  /**
   * The `utm_content` base. A `-store` suffix is appended automatically when
   * `leadType` resolves to a storefront segment, so the destination change stays
   * readable in the store-side scoreboard instead of averaging into the
   * marketing-page history under the same tag. Pass the base, never the
   * suffixed value. Same convention as `HeroAffiliateDoor`.
   */
  affiliateContent?: string;
  /**
   * An explicit marketing path on `agedleadstore.com`. Only consulted when
   * `leadType` resolves no storefront segment — the storefront is strictly
   * closer to a cart, so it outranks a hand-passed marketing path.
   */
  affiliatePath?: string;
  /**
   * A Sanity `leadType.title` ("Mortgage Leads") or a slug — both work. Supplying
   * it opts this banner into the hero door's destination precedence
   * (storefront segment -> marketing buy page -> full catalogue) and labels the
   * button with the vertical. Omit it and the banner behaves exactly as before:
   * generic copy, `affiliatePath` or the full catalogue, unsuffixed `utm_content`.
   */
  leadType?: string;
}

export function CtaBanner({
  headline,
  description,
  buttonText,
  buttonHref,
  secondaryText,
  secondaryHref,
  campaign = "cta-banner",
  variant = "default",
  affiliate = true,
  affiliateContent = "primary",
  affiliatePath,
  leadType,
}: CtaBannerProps) {
  // Not sold by the partner (legal/MVA/SSDI since 2026-11-23): fall back to the
  // non-affiliate "compare providers" banner, pointed at that vertical.
  const stocked = partnerSells(leadType);
  const useAffiliate = affiliate && !buttonHref && stocked;

  /*
    Destination precedence: storefront segment -> marketing buy page -> full
    catalogue. Every step is strictly closer to a cart, and each falls through
    only when the one above it does not exist for this vertical.

    Legal, SSDI and MVA land on the middle rung by design — `/legal/leads` is a
    verified 404 and the partner sells all legal intake from the marketing page,
    so `storeCategoryPath` is the best available answer there, not a fallback
    that failed. Medicare and the generic insurance bucket have neither a
    segment nor a buy page and correctly reach the catalogue.
  */
  const destination = affiliateDestination({
    leadType,
    campaign,
    content: affiliateContent,
    fallbackPath: affiliatePath,
  });
  const segment = destination.segment;

  /*
    `-store` suffix so the destination change is legible in the scoreboard
    instead of averaging into the marketing-page history under the same tag.
    Two buckets, not one per vertical — a tag per vertical would make every
    future reading underpowered by construction.
  */
  const resolvedContent = destination.content;

  const verticalLabel = agedLeadLabel(leadType);

  const finalHeadline =
    headline ??
    (useAffiliate
      ? "Ready to Buy Aged Leads?"
      : "Find the Right Lead Provider");
  const finalDescription =
    description ??
    (useAffiliate
      ? segment
        ? // Expectation-setting, not a price claim: the storefront is a buying
          // screen, and saying so is what makes the click worth making.
          `Filter ${verticalLabel} by state and see current pricing before you buy — low minimum, no contract.`
        : "Browse aged leads across mortgage, insurance, home services, and more — with data verification and hygiene, suppression support, and fair-market pricing."
      : "Compare providers, check fair market pricing, and calculate your ROI — all with our free tools.");
  const finalButtonText =
    buttonText ??
    (useAffiliate
      ? segment
        ? // "Shop" rather than "Browse" when the link lands on the storefront:
          // a label promising browsing sets the reader up to bounce off a
          // buying screen. "Browse" stays accurate for a marketing page.
          `Shop ${verticalLabel}`
        : leadType
          ? `Browse ${verticalLabel} at Aged Lead Store`
          : "Browse Aged Leads at Aged Lead Store"
      : "Compare Providers");
  const finalSecondaryText =
    secondaryText ?? (useAffiliate ? "Compare All Providers" : "Check Pricing");
  const finalSecondaryHref = useAffiliate
    ? secondaryHref ?? "/providers"
    : secondaryHref ?? "/price-index";

  const primaryUrl = useAffiliate
    ? destination.href
    : buttonHref ?? (stocked ? "/providers" : providerCompareHref(leadType));

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {finalHeadline}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {finalDescription}
            </p>
          </div>
          {useAffiliate ? (
            <TrackedAffiliateLink
              href={primaryUrl}
              ctaId={`cta-banner-${campaign}-${resolvedContent}`}
              ctaLocation="cta-banner-compact"
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {finalButtonText}
            </TrackedAffiliateLink>
          ) : (
            <Link
              href={primaryUrl}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {finalButtonText}
            </Link>
          )}
        </div>
        {useAffiliate && (
          <PromoCodeNote className="mt-3 text-zinc-700 dark:text-zinc-300" />
        )}
        {useAffiliate && (
          <p className="mt-3 text-xs text-zinc-500">
            Affiliate link — we may earn a commission at no cost to you, and it
            never affects our ratings.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Disclosure
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {finalHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          {finalDescription}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {useAffiliate ? (
            <TrackedAffiliateLink
              href={primaryUrl}
              ctaId={`cta-banner-${campaign}-${resolvedContent}`}
              ctaLocation="cta-banner"
              className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
            >
              {finalButtonText}
            </TrackedAffiliateLink>
          ) : (
            <Link
              href={primaryUrl}
              className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
            >
              {finalButtonText}
            </Link>
          )}
          <Link
            href={finalSecondaryHref}
            className="rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            {finalSecondaryText}
          </Link>
        </div>
        {/* FINISH2026 code beside the bottom door, which every blog post and
            the partner review end on. Client-side window, same as the bar. */}
        {useAffiliate && <PromoCodeNote className="mt-6 text-white" />}
        {useAffiliate && (
          <p className="mx-auto mt-6 max-w-2xl text-xs text-blue-100/80">
            Affiliate link — we may earn a commission at no cost to you, and it
            never affects our ratings or recommendations.{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-white">
              Disclosure
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
