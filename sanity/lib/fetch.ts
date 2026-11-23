import { client } from "../client";
import { withRetry } from "./retry";

/**
 * Every Sanity-backed route in this app is prerendered at build time. Without a
 * cache directive Next treats that prerender as permanent, so publishing in the
 * Studio changed nothing on the live site until the next deploy — the dynamic
 * `/lead-types/[slug]` route picked a new document up immediately while the
 * static `/lead-types` index and `/sitemap.xml` kept serving build-time HTML,
 * which reads as "the CMS is broken" rather than "the page is cached".
 *
 * Tagging each query fixes both halves: `revalidateTag(SANITY_CACHE_TAG)` from
 * the Studio webhook (see app/api/revalidate/route.ts) flushes every Sanity page
 * at once, and the time window below bounds the staleness even when no webhook
 * is configured. The webhook is the fast path; the window is the guarantee.
 */
export const SANITY_CACHE_TAG = "sanity";

/**
 * Fallback staleness bound, in seconds. Only reached when the webhook is not
 * configured or did not fire. Publishing here runs a few times a week and these
 * are cheap static pages, so a short window costs little — regeneration is
 * request-driven, not scheduled.
 */
export const SANITY_REVALIDATE_SECONDS = 300;

export interface SanityFetchOptions {
  /** Extra cache tags, on top of the global one. Enables narrower purges later. */
  tags?: string[];
  /** Override the staleness bound for a single query. */
  revalidate?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityFetch<T = any>(
  query: string,
  // GROQ accepts strings, numbers, booleans, and arrays as params; widen to any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
  options?: SanityFetchOptions
): Promise<T | null> {
  const sanity = client;
  if (!sanity) return null;
  // Timeout and retry on transient network errors; see ./retry.ts for why.
  return withRetry((signal) =>
    sanity.fetch<T>(query, params ?? {}, {
      signal,
      next: {
        tags: [SANITY_CACHE_TAG, ...(options?.tags ?? [])],
        revalidate: options?.revalidate ?? SANITY_REVALIDATE_SECONDS,
      },
    })
  );
}
