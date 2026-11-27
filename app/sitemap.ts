import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PROVIDERS,
  getProviderPairs,
  getProvidersByVertical,
} from "@/data/providers";
import { VERTICALS } from "@/data/verticals";
import { hasTrustworthyBenchmarks } from "@/lib/benchmark-coverage";
import { GUIDES, GUIDE_SLUGS } from "@/data/guides";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

type ContentItem = { slug: string; lastModified: string };

async function fetchCmsContent() {
  try {
    const data = await sanityFetch<{
      posts: ContentItem[];
      leadTypes: ContentItem[];
      playbooks: ContentItem[];
      glossaryTerms: ContentItem[];
      guides: ContentItem[];
      categories: { slug: string }[];
    }>(`{
      "posts": *[_type == "post"]{ "slug": slug.current, "lastModified": _updatedAt },
      "leadTypes": *[_type == "leadType"]{ "slug": slug.current, "lastModified": _updatedAt },
      "playbooks": *[_type == "playbook"]{ "slug": slug.current, "lastModified": _updatedAt },
      "glossaryTerms": *[_type == "glossaryTerm"]{ "slug": slug.current, "lastModified": _updatedAt },
      "guides": *[_type == "guide"]{ "slug": slug.current, "lastModified": _updatedAt },
      "categories": *[_type == "category"]{ "slug": slug.current }
    }`);
    return data;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchCmsContent();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lead-types`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/playbook`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/playbook/mortgage`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/playbook/insurance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/playbook/home-services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/providers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/price-index`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/calculators/know-your-cpl`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/aged-lead-industry-statistics`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/authors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/book`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/editorial-process`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Provider profiles
  for (const provider of PROVIDERS) {
    entries.push({
      url: `${baseUrl}/providers/${provider.slug}`,
      lastModified: new Date(provider.lastVerified),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Best-of-vertical + price-index pages. Both routes auto-generate for every
  // vertical, but thin ones are noindexed at the page level (best-providers
  // with <2 providers; price-index with no reliable benchmark data) — mirror
  // that here so the sitemap never advertises a noindexed page. They rejoin
  // automatically once real providers/benchmarks are added.
  const benchmarkCoverage = await Promise.all(
    VERTICALS.map((v) => hasTrustworthyBenchmarks(v.slug))
  );
  VERTICALS.forEach((vertical, i) => {
    if (getProvidersByVertical(vertical.slug).length >= 2) {
      entries.push({
        url: `${baseUrl}/providers/best/${vertical.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    if (benchmarkCoverage[i]) {
      entries.push({
        url: `${baseUrl}/price-index/${vertical.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  });

  // Hub for every comparison below. Added 2026-07-21: the comparison cluster
  // had no index and no inbound links from anywhere on the site, so the pages
  // were reachable only via this sitemap despite being the best-converting
  // format on the site.
  entries.push({
    url: `${baseUrl}/compare`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  // Editorial comparison pages (literal /compare routes, hand-written).
  for (const slug of [
    "aged-vs-real-time-leads",
    "medicare-advantage-vs-supplement",
    "iul-vs-term-life",
  ]) {
    entries.push({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Comparison pages — only the pairings involving Aged Lead Store are
  // listed in the sitemap. The other 91 pairs render but are noindexed
  // (see app/(site)/compare/[pair]/page.tsx) so they shouldn't be advertised
  // to Google. Mirror the same rule here.
  for (const [a, b] of getProviderPairs()) {
    if (a !== "aged-lead-store" && b !== "aged-lead-store") continue;
    entries.push({
      url: `${baseUrl}/compare/${a}-vs-${b}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  if (data) {
    for (const post of data.posts || []) {
      entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.lastModified), priority: 0.7 });
    }
    for (const lt of data.leadTypes || []) {
      entries.push({ url: `${baseUrl}/lead-types/${lt.slug}`, lastModified: new Date(lt.lastModified), priority: 0.8 });
    }
    // Deprecated: the 4 Sanity playbooks now 301 to /playbook (flagship master).
    // Omitted from sitemap to avoid crawling redirected URLs.
    for (const term of data.glossaryTerms || []) {
      entries.push({ url: `${baseUrl}/glossary/${term.slug}`, lastModified: new Date(term.lastModified), priority: 0.6 });
    }
    // Code-backed operator guides (data/guides.ts) are not in Sanity, so the CMS
    // query above cannot see them. Emitted separately, and deduped against the CMS
    // list in case a slug ever exists in both.
    const cmsGuideSlugs = new Set((data.guides || []).map((g) => g.slug));
    for (const slug of GUIDE_SLUGS) {
      if (cmsGuideSlugs.has(slug)) continue;
      entries.push({
        url: `${baseUrl}/guides/${slug}`,
        lastModified: new Date(GUIDES[slug].updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const guide of data.guides || []) {
      entries.push({ url: `${baseUrl}/guides/${guide.slug}`, lastModified: new Date(guide.lastModified), priority: 0.7 });
    }
    for (const cat of data.categories || []) {
      entries.push({ url: `${baseUrl}/blog/category/${cat.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });
    }
  }

  return entries;
}
