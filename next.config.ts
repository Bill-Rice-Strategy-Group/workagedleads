import type { NextConfig } from "next";
import { migrationRedirects, legacyHostPathChanges } from "./lib/migration-redirects";
import { affiliateUrl } from "./lib/affiliate";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      // howtoworkleads.com/lead-order was never a page — it is a CTA endpoint
      // that 307s to the affiliate with UTM tagging, and 36 links across the
      // corpus point at it (six on pages that survive the migration, two of
      // them body copy in the cornerstone article). Recreated here so those
      // links keep working after the consolidation.
      //
      // Deliberately NOT permanent: a 301 invites search engines to treat an
      // affiliate exit as the canonical destination. The UTM source comes from
      // lib/affiliate.ts, so it updates in one place at cutover — once Troy has
      // confirmed whether affiliate credit is keyed to utm_source or the
      // referring domain (Phase 0, still open).
      {
        source: "/lead-order",
        destination: affiliateUrl({
          campaign: "lead-order-redirect",
          content: "legacy-htwl-endpoint",
        }),
        permanent: false,
      },

      // FINISH2026 (Nov 2026): a clean, branded short link for Bill's personal
      // notes to top buyers. A raw agedleadstore.com URL with four UTM params
      // reads as spammy in a 1:1 email; workagedleads.com/finish2026 is the
      // sender's own domain and still lands fully tagged. Not permanent, same
      // reasoning as /lead-order. `?ref=` variants are not needed: every note
      // shares one utm_content so personal-note revenue reads as one line.
      {
        source: "/finish2026",
        destination: affiliateUrl({ campaign: "finish2026", content: "personal-note" }),
        permanent: false,
      },
      // Same, for Bill's LinkedIn post (first comment), so social clicks read
      // separately from the personal notes.
      {
        source: "/finish2026-li",
        destination: affiliateUrl({ campaign: "finish2026", content: "linkedin" }),
        permanent: false,
      },

      // LeadsData retired 2026-11-23 (no longer sells leads). Its profile goes
      // to the directory; each compare page that paired it goes to the other
      // provider's profile, the closest surviving answer to that query. Pair
      // slugs are alphabetical, so leadsdata can sit on either side.
      {
        source: "/providers/leadsdata",
        destination: "/providers",
        permanent: true,
      },
      {
        source: "/compare/leadsdata-vs-:other",
        destination: "/providers/:other",
        permanent: true,
      },
      {
        source: "/compare/:other-vs-leadsdata",
        destination: "/providers/:other",
        permanent: true,
      },

      // The home-improvement vertical had two lead-type pages: the canonical
      // slug and a legacy one carrying all the content. The content moved to
      // the canonical slug, so the legacy page has to stop resolving or the
      // site publishes the same ~2,900 words at two URLs.
      {
        source: "/lead-types/home-services-leads",
        destination: "/lead-types/home-improvement-leads",
        permanent: true,
      },

      // On the retiring host only, send a path-changing URL straight to its
      // final address instead of rewriting the path here and letting proxy.ts
      // move the host afterwards. Two hops become one.
      //
      // MUST precede the same-path rules below: first match wins, and these
      // are the host-qualified version of them. Generated from url-map.csv, so
      // the pair cannot drift.
      ...legacyHostPathChanges(),

      // Specific deprecated /playbooks pages that still hold page-1 rankings get
      // remapped to MATCHING content (not the generic master) so the equity isn't
      // wasted on a topic mismatch. Must come BEFORE the catch-all (first match wins).
      // These stay path-relative: they also serve workagedleads.com itself.
      {
        // Ranks ~pos 6 for "follow-up cadence" intent — rebuilt as a real guide.
        source: "/playbooks/7-day-aged-lead-follow-up-cadence",
        destination: "/guides/7-day-aged-lead-follow-up-cadence",
        permanent: true,
      },
      {
        source: "/playbooks/mortgage-rate-shopping-playbook",
        destination: "/lead-types/mortgage-leads",
        permanent: true,
      },
      {
        source: "/playbooks/tracking-aged-lead-roi-metrics",
        destination: "/calculators/roi-calculator",
        permanent: true,
      },

      // Near-duplicate blog posts produced by the (now-disabled) weekly-content
      // cron. Each pair cannibalized the same query; the canonical (older, more
      // comprehensive) post wins and the cron dupe 308-redirects into it. The
      // redirected slugs are unpublished in Sanity so they also drop from the
      // sitemap (scripts/unpublish-duplicate-posts.mjs). Disabled 2026-06-23.
      {
        source: "/blog/aged-lead-budget-allocation-roi-optimization",
        destination: "/blog/aged-lead-budget-allocation-strategy",
        permanent: true,
      },
      {
        source: "/blog/aged-lead-team-training-playbook-managers",
        destination: "/blog/training-aged-lead-sales-team",
        permanent: true,
      },
      {
        source: "/blog/summer-solar-aged-lead-activation-strategy",
        destination: "/blog/summer-solar-sales-aged-leads-q2-strategy",
        permanent: true,
      },

      // workagedleads.com consolidation — path-level redirects generated from
      // data/migration/url-map.csv. None of these sources start with
      // /playbooks, so they cannot shadow (or be shadowed by) the rules above
      // or the catch-all below. Edit the CSV, not this file.
      ...migrationRedirects(),

      // Old plural /playbooks routes funnel into the new flagship /playbook master.
      // The 4 old Sanity-backed playbook pages are deprecated in favor of the
      // consolidated "Aged Lead Operator's System" flagship magnet.
      // MUST stay last — /playbooks/:slug* is a catch-all.
      {
        source: "/playbooks",
        destination: "/playbook",
        permanent: true,
      },
      {
        source: "/playbooks/:slug*",
        destination: "/playbook",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
