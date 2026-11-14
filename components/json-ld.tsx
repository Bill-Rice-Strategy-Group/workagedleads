import { billRicePersonRef } from "@/lib/identity";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

/**
 * One URI for the site's publisher, on every page that names it. Before this,
 * the Organization was emitted only on the homepage, with no @id, and every
 * Article re-declared a nameless-identity copy — so crawlers saw several
 * unconnected "Work Aged Leads" organizations rather than one entity.
 *
 * Always the production origin, never a preview host: an @id is an identifier,
 * not a link, and it must be the same string everywhere.
 */
export const ORGANIZATION_ID = "https://workagedleads.com/#organization";

/**
 * Former names. The site was agedleadsales.com and howtoworkleads.com until the
 * 2026-08-03 consolidation; both 301 here. Declaring them lets search engines
 * and assistants resolve citations of the old brands to this entity.
 */
const ORGANIZATION_ALTERNATE_NAMES = ["Aged Lead Sales", "How To Work Leads"];

/**
 * Profiles that ARE this organization. Deliberately empty: the brand has no
 * verified social or knowledge-graph profiles of its own yet, and listing
 * Bill's personal accounts here would assert they are the company. Add the
 * Wikidata item once it exists (BACKLOG "Entity SEO — Wikidata Entry").
 */
const ORGANIZATION_SAME_AS: string[] = [];

/** Compact publisher node for Article/WebPage slots — same @id as the full one. */
export const organizationRef = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Work Aged Leads",
  url: "https://workagedleads.com",
};

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Work Aged Leads",
    "@id": "https://workagedleads.com/#website",
    url: baseUrl,
    alternateName: ORGANIZATION_ALTERNATE_NAMES,
    description:
      "Learn how to grow your sales business with aged leads. Training, playbooks, and strategies for insurance agents, mortgage brokers, and sales professionals.",
    // The site's publisher is the organization; Bill is its founder. This used
    // to name the person as publisher, which split the brand entity in two.
    publisher: { "@id": ORGANIZATION_ID },
    // SearchAction removed: it advertised /glossary?q={search_term_string}, but
    // <GlossarySearch> filters from local useState and never reads a `q` URL
    // param — the link did nothing. Wiring the component to seed its query from
    // ?q= would make the declaration true and let this come back.
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Work Aged Leads",
    alternateName: ORGANIZATION_ALTERNATE_NAMES,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/apple-icon`,
      width: 180,
      height: 180,
    },
    founder: personJsonLdData(),
    parentOrganization: {
      "@type": "Organization",
      name: "Bill Rice Strategy Group",
      url: "https://billricestrategy.com",
    },
    knowsAbout: [
      "Aged leads",
      "Lead buying",
      "Insurance leads",
      "Mortgage leads",
      "TCPA compliance for purchased leads",
    ],
    ...(ORGANIZATION_SAME_AS.length > 0 && { sameAs: ORGANIZATION_SAME_AS }),
    description:
      "Independent training, pricing data and provider reviews for sales professionals who buy and work aged leads.",
  };
}

export function personJsonLdData() {
  return {
    // Canonical person URI, shared across every property Bill owns. This used
    // to mint agedleadsales.com/about/bill-rice#person — a third distinct Bill
    // Rice, unconnected to any other site.
    ...billRicePersonRef,
    jobTitle: "Founder & Lead Conversion Expert",
    description:
      "30+ years building lead conversion systems across insurance, mortgage, solar, and home improvement. Founder of Kaleidico. Marketing director for Aged Lead Store.",
    knowsAbout: [
      "Aged Leads",
      "Lead Generation",
      "Lead Conversion",
      "Insurance Sales",
      "Mortgage Sales",
      "Sales Training",
      "Digital Marketing",
    ],
    // sameAs comes from billRicePersonRef. The two entries removed here —
    // howtoworkleads.com/resources/about and kaleidico.com/bill-rice/ — are
    // pages *about* Bill, not profiles that *are* him; Kaleidico is already
    // expressed below as worksFor, which is the accurate relationship.
    worksFor: [
      organizationRef,
      {
        "@type": "Organization",
        name: "Kaleidico",
        url: "https://kaleidico.com",
      },
    ],
  };
}

export function personPageJsonLd() {
  return {
    "@context": "https://schema.org",
    ...personJsonLdData(),
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const isKnownAuthor = authorName === "Bill Rice";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${baseUrl}/blog/${slug}`,
    ...(publishedAt && { datePublished: publishedAt }),
    ...(modifiedAt && { dateModified: modifiedAt }),
    author: isKnownAuthor
      ? personJsonLdData()
      : authorName
        ? { "@type": "Person", name: authorName }
        : personJsonLdData(),
    ...(imageUrl && { image: imageUrl }),
    publisher: organizationRef,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".key-takeaway-box", ".prose-wrapper h2 + p"],
    },
  };
}

/**
 * WebPage node carrying a `speakable` spec, for page types that are not
 * Articles (lead-type guides, comparisons). Articles declare speakable on the
 * Article node itself. Selectors must match elements that hold a short,
 * self-contained answer — the hero definition, the key takeaways.
 */
export function speakableWebPageJsonLd({
  name,
  url,
  cssSelector,
}: {
  name: string;
  url: string;
  cssSelector: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    publisher: organizationRef,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function howToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function glossaryTermJsonLd({
  term,
  definition,
  slug,
}: {
  term: string;
  definition: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
    url: `${baseUrl}/glossary/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Work Aged Leads Glossary",
      url: `${baseUrl}/glossary`,
    },
  };
}

export function webApplicationJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${baseUrl}/calculators/${slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
