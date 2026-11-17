"use client";

import { useSyncExternalStore } from "react";
import { affiliateUrl } from "@/lib/affiliate";
import {
  finish2026Active,
  FINISH2026_CAMPAIGN,
  FINISH2026_CODE,
  FINISH2026_DISCOUNT,
  FINISH2026_ENDS_TEXT,
} from "@/lib/newsletter/finish2026";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

/**
 * Sitewide strip for the FINISH2026 partner discount (Nov 2026).
 *
 * Decided on the client, after mount, on purpose. Pages here are statically
 * cached, so a server-side date check would freeze into the cached HTML and
 * the bar would keep advertising a dead code until the next deploy. Checking
 * in the browser means it disappears at the end of the last day on its own.
 * The cost is that it appears just after first paint and not in the HTML
 * crawlers see, which is fine for a two-week promotion.
 *
 * Remove this component (and its line in app/(site)/layout.tsx) once the
 * campaign is over; finish2026Active() already keeps it hidden until then.
 */
const HREF = affiliateUrl({ campaign: FINISH2026_CAMPAIGN, content: "promo-bar" });

const noSubscribe = () => () => {};

export function PromoBar() {
  // false on the server and during hydration, the real check in the browser.
  const show = useSyncExternalStore(noSubscribe, () => finish2026Active(), () => false);
  if (!show) return null;

  return (
    <div className="bg-blue-700 px-4 py-2 text-center text-sm text-white">
      <span className="font-semibold">{FINISH2026_DISCOUNT} off aged leads</span>{" "}
      at Aged Lead Store with code{" "}
      <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono font-bold tracking-wider">
        {FINISH2026_CODE}
      </span>{" "}
      through {FINISH2026_ENDS_TEXT}.{" "}
      <TrackedAffiliateLink
        href={HREF}
        ctaId="finish2026-promo-bar"
        ctaLocation="promo-bar"
        className="font-semibold underline underline-offset-2 hover:text-blue-100"
      >
        Shop leads &rarr;
      </TrackedAffiliateLink>
    </div>
  );
}
