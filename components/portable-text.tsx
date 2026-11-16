import {
  PortableText as PortableTextComponent,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { urlForImage } from "@/sanity/lib/image";
import { extractYouTubeId } from "@/sanity/schemaTypes/objects/videoEmbed";
import { GlossaryTooltip } from "./glossary-tooltip";
import {
  injectGlossaryLinks,
  type GlossaryEntry,
} from "@/lib/glossary-linker";
import { isAffiliateDomain, tagAffiliateHref } from "@/lib/affiliate";

const MID_ARTICLE_CTAS = [
  {
    text: "Looking for leads?",
    link: "Compare top providers for your vertical",
    href: "/providers",
    suffix: "— independent ratings across 15+ verticals.",
  },
  {
    text: "What should you pay?",
    link: "Check our Lead Price Index",
    href: "/price-index",
    suffix: "— fair market benchmarks updated monthly.",
  },
  {
    text: "Want to calculate your ROI?",
    link: "Try our free CPL calculator",
    href: "/calculators/know-your-cpl",
    suffix: "— compare aged vs. real-time leads for your business.",
  },
];

const CONTENT_CHECKPOINTS = [
  {
    stat: "10-50x",
    context: "lower cost per lead with aged leads vs. real-time leads",
    source: "Work Aged Leads Price Index",
    href: "/price-index",
  },
  {
    stat: "30%",
    context: "average contact rate on 31-85 day aged leads across all verticals",
    source: "Provider Directory",
    href: "/providers",
  },
  {
    stat: "18+",
    context: "lead providers independently rated in our directory",
    source: "Provider Directory",
    href: "/providers",
  },
  {
    stat: "$2-$15",
    context: "typical cost per aged lead vs. $25-$150+ for real-time leads",
    source: "Lead Price Index",
    href: "/price-index",
  },
];

function MidArticleCta({ index }: { index: number }) {
  const cta = MID_ARTICLE_CTAS[index % MID_ARTICLE_CTAS.length];

  return (
    <p className="my-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <strong className="text-zinc-800 dark:text-zinc-200">
        {cta.text}
      </strong>{" "}
      <a
        href={cta.href}
        className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
      >
        {cta.link}
      </a>{" "}
      {cta.suffix}
    </p>
  );
}

function ContentCheckpoint({ index }: { index: number }) {
  const cp = CONTENT_CHECKPOINTS[index % CONTENT_CHECKPOINTS.length];

  return (
    <div className="my-10 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {cp.stat}
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {cp.context}
      </p>
      <a
        href={cp.href}
        className="mt-2 inline-block text-xs font-medium text-zinc-400 underline decoration-zinc-300 hover:text-zinc-600 dark:text-zinc-500 dark:decoration-zinc-700"
      >
        Source: {cp.source}
      </a>
    </div>
  );
}

/** Generate a URL-safe slug from heading text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract h2 headings from PortableText blocks */
export function extractHeadings(
  blocks: PortableTextBlock[]
): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const usedIds = new Set<string>();

  for (const block of blocks) {
    const b = block as { _type?: string; style?: string; children?: { text?: string }[] };
    if (b._type === "block" && b.style === "h2" && b.children) {
      const text = b.children.map((c) => c.text || "").join("");
      if (text) {
        let id = slugify(text);
        // Deduplicate IDs
        if (usedIds.has(id)) {
          let n = 2;
          while (usedIds.has(`${id}-${n}`)) n++;
          id = `${id}-${n}`;
        }
        usedIds.add(id);
        headings.push({ id, text });
      }
    }
  }

  return headings;
}

/** Build a heading ID map from blocks (keyed by block _key) */
export function buildHeadingIdMap(
  blocks: PortableTextBlock[]
): Map<string, string> {
  const headings = extractHeadings(blocks);
  const map = new Map<string, string>();
  let hIdx = 0;

  for (const block of blocks) {
    const b = block as { _type?: string; style?: string; _key?: string };
    if (b._type === "block" && b.style === "h2" && b._key && hIdx < headings.length) {
      map.set(b._key, headings[hIdx].id);
      hIdx++;
    }
  }

  return map;
}

/**
 * An editor-authored body link. Links to the affiliate partner get this site's
 * UTM tags (see `tagAffiliateHref`) and `rel="nofollow sponsored"`, matching
 * every component-built affiliate link. Every other link renders as before.
 */
function bodyLinkAttrs(href: string | undefined, campaign: string) {
  if (!href) return { href };
  const external = href.startsWith("http");
  let affiliate = false;
  if (external) {
    try {
      affiliate = isAffiliateDomain(new URL(href).hostname.toLowerCase());
    } catch {
      affiliate = false;
    }
  }
  if (affiliate) {
    return {
      href: tagAffiliateHref(href, campaign, "body-link"),
      target: "_blank",
      rel: "nofollow sponsored noopener noreferrer",
    };
  }
  return {
    href,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
  };
}

function buildComponents(campaign: string, headingIds?: Map<string, string>): PortableTextComponents {
  return {
    block: {
      h1: ({ children }) => (
        <h1 className="mb-6 mt-10 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
          {children}
        </h1>
      ),
      h2: ({ children, value }) => {
        const id = value._key ? headingIds?.get(value._key) : undefined;
        return (
          <h2
            id={id}
            className="mb-4 mt-8 scroll-mt-20 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }) => (
        <h3 className="mb-3 mt-6 text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mb-2 mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-zinc-600 dark:text-zinc-400">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="mb-4 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
      number: ({ children }) => <li className="leading-relaxed">{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-zinc-900 dark:text-white">
          {children}
        </strong>
      ),
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
          {children}
        </code>
      ),
      link: ({ children, value }) => (
        <a
          {...bodyLinkAttrs(value?.href, campaign)}
          className="text-blue-600 underline decoration-blue-600/30 transition-colors hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400 dark:decoration-blue-400/30"
        >
          {children}
        </a>
      ),
      glossaryTerm: ({ children, value }) => (
        <GlossaryTooltip
          term={value?.term || ""}
          definition={value?.definition || ""}
          slug={value?.slug || ""}
        >
          {children}
        </GlossaryTooltip>
      ),
    },
    types: {
      /*
        Video. Added 2026-10-07 after a raw <iframe> pasted into a post body
        rendered as a wall of escaped markup on the site's top blog post.

        The schema stores an ID, never markup, so content cannot inject HTML
        again. youtube-nocookie keeps a reader who merely scrolls past out of
        YouTube's ad-tracking cookies. The aspect-ratio wrapper is what keeps it
        from overflowing on a phone — the original paste was also the cause of
        31px of horizontal scroll at 390px.
      */
      videoEmbed: ({ value }) => {
        const id = extractYouTubeId(String(value?.url ?? ""));
        if (!id) return null;
        const title = String(value?.title ?? "Video");

        return (
          <figure className="my-8">
            <div className="relative w-full overflow-hidden rounded-lg bg-zinc-900 pt-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            {value?.caption ? (
              <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-500">
                {String(value.caption)}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      image: ({ value }) => {
        const imageUrl = urlForImage(value)?.width(1200).url();
        if (!imageUrl) return null;

        return (
          <figure className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={value.alt || ""}
              className="w-full rounded-lg"
              loading="lazy"
            />
            {value.caption && (
              <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-500">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      table: ({ value }) => {
        const rows = (value?.rows as { cells?: string[] }[] | undefined) || [];
        if (rows.length === 0) return null;
        const [headerRow, ...bodyRows] = rows;
        const caption = value?.caption as string | undefined;

        return (
          <figure className="my-8">
            {caption && (
              <figcaption className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {caption}
              </figcaption>
            )}
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full border-collapse text-sm">
                {headerRow?.cells && (
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      {headerRow.cells.map((cell, i) => (
                        <th
                          key={i}
                          className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-900 dark:border-zinc-800 dark:text-white"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                    >
                      {(row.cells || []).map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-4 py-3 align-top text-zinc-700 dark:text-zinc-300"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        );
      },
      codeBlock: ({ value }) => {
        const code = (value?.code as string) || "";
        const language = value?.language as string | undefined;
        const filename = value?.filename as string | undefined;
        const label = filename || language;

        return (
          <figure className="my-6 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-900 dark:border-zinc-800">
            {label && (
              <figcaption className="border-b border-zinc-800 bg-zinc-950 px-4 py-2 font-mono text-xs text-zinc-400">
                {label}
              </figcaption>
            )}
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code className="font-mono text-zinc-100">{code}</code>
            </pre>
          </figure>
        );
      },
    },
  };
}

// Insert interval: place a CTA after every N h2 headings
const CTA_EVERY_N_SECTIONS = 3;
// Minimum blocks before first CTA (skip short articles)
const MIN_BLOCKS_FOR_CTAS = 25;

interface PortableTextProps {
  value: PortableTextBlock[];
  campaign?: string;
  glossary?: GlossaryEntry[];
  headingIds?: Map<string, string>;
}

export function PortableText({ value, campaign = "article", glossary, headingIds }: PortableTextProps) {
  // Pre-process blocks to inject glossary tooltip annotations
  const processedValue =
    glossary && glossary.length > 0
      ? injectGlossaryLinks(value, glossary)
      : value;

  const ptComponents = buildComponents(campaign, headingIds);

  if (!processedValue || processedValue.length < MIN_BLOCKS_FOR_CTAS) {
    return <PortableTextComponent components={ptComponents} value={processedValue} />;
  }

  // Find h2 positions to insert CTAs between sections
  const h2Indices: number[] = [];
  for (let i = 0; i < processedValue.length; i++) {
    const block = processedValue[i] as { _type?: string; style?: string };
    if (block._type === "block" && block.style === "h2") {
      h2Indices.push(i);
    }
  }

  // Not enough sections for mid-article CTAs
  if (h2Indices.length < CTA_EVERY_N_SECTIONS + 1) {
    return <PortableTextComponent components={ptComponents} value={processedValue} />;
  }

  // Determine split points: after every Nth h2 (insert CTA before the next h2)
  const splitPoints: number[] = [];
  for (let i = CTA_EVERY_N_SECTIONS; i < h2Indices.length; i += CTA_EVERY_N_SECTIONS) {
    splitPoints.push(h2Indices[i]);
  }

  // Build chunks
  const chunks: PortableTextBlock[][] = [];
  let start = 0;
  for (const splitAt of splitPoints) {
    chunks.push(processedValue.slice(start, splitAt));
    start = splitAt;
  }
  chunks.push(processedValue.slice(start));

  return (
    <>
      {chunks.map((chunk, i) => (
        <div key={i}>
          {i > 0 && (
            i % 2 === 1
              ? <MidArticleCta index={Math.floor(i / 2)} />
              : <ContentCheckpoint index={Math.floor((i - 1) / 2)} />
          )}
          <PortableTextComponent components={ptComponents} value={chunk} />
        </div>
      ))}
    </>
  );
}
