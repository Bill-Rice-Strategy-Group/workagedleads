/**
 * Dedupe gate for the weekly-content routine.
 *
 * Why this exists: between April and July 2026 the routine re-picked
 * "aged life insurance leads" 20 times and "aged final expense leads" 7 times,
 * opening a PR each time (#3-#36, all closed unmerged 2026-07-21). It had a
 * title-similarity check, but only at PUBLISH time against published posts —
 * after the article was already written — and it never looked at open PRs,
 * where the earlier drafts were sitting.
 *
 * This gate runs BEFORE any article is written and rejects a brief when:
 *   1. its slug is already used by a post;
 *   2. every meaningful word of its primary keyword already appears in one
 *      existing post's title or slug (the keyword is already targeted);
 *   3. its title is close to an existing post title or an open PR title;
 *   4. an open PR title already covers its primary keyword;
 *   5. an earlier brief in the same batch has the same primary keyword.
 *
 * Erring toward rejection is deliberate: a skipped week costs nothing, a
 * duplicate post cannibalises a page that already ranks.
 *
 * Drafts convention (the one in use on main; the other two that the closed PRs
 * used — `content/drafts/<date>-<slug>.md` and `content/drafts/<slug>/draft.md`
 * — are retired): `content/drafts-YYYY-MM-DD/NN-<slug>/draft.md`.
 */

export interface DedupeBrief {
  slug: string;
  title: string;
  primaryKeyword: string;
}

export interface DedupePost {
  slug: string;
  title: string;
}

export interface DedupeRejection<B extends DedupeBrief> {
  brief: B;
  reason: string;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "for", "of", "to", "in", "on", "at",
  "by", "with", "is", "are", "be", "how", "what", "why", "your", "you", "this",
  "that", "from", "as", "it", "vs", "guide", "complete", "ultimate", "beginner",
  "beginners", "2024", "2025", "2026", "2027",
  // The site's own vocabulary: on an aged-leads site every title carries these,
  // so they say nothing about the topic.
  "aged", "lead", "leads",
]);

/** Meaningful lowercase word tokens; slugs and titles both work. */
export function topicTokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / new Set([...a, ...b]).size;
}

function covers(haystack: Set<string>, needle: Set<string>): boolean {
  for (const t of needle) if (!haystack.has(t)) return false;
  return true;
}

/**
 * A keyword with fewer meaningful tokens than this is too generic to judge by
 * coverage ("aged leads" has none; "insurance" matches half the archive). Those
 * are still caught by the slug and title checks.
 */
const MIN_KEYWORD_TOKENS = 2;

/** Title Jaccard similarity at or above this is the same article. */
export const TITLE_SIMILARITY_THRESHOLD = 0.6;

export function dedupeBriefs<B extends DedupeBrief>(
  briefs: B[],
  existingPosts: DedupePost[],
  openPrTitles: string[]
): { kept: B[]; rejected: DedupeRejection<B>[] } {
  const kept: B[] = [];
  const rejected: DedupeRejection<B>[] = [];
  const seenKeywords = new Map<string, string>();

  const posts = existingPosts.map((p) => ({
    ...p,
    titleTokens: topicTokens(p.title),
    allTokens: new Set([...topicTokens(p.title), ...topicTokens(p.slug)]),
  }));
  const prs = openPrTitles.map((t) => ({ title: t, tokens: topicTokens(t) }));

  for (const brief of briefs) {
    const reject = (reason: string) => rejected.push({ brief, reason });
    const kwTokens = topicTokens(brief.primaryKeyword);
    const titleTokens = topicTokens(brief.title);
    const kwKey = brief.primaryKeyword.trim().toLowerCase();

    const slugHit = posts.find((p) => p.slug === brief.slug);
    if (slugHit) {
      reject(`slug already used by "${slugHit.title}"`);
      continue;
    }

    if (seenKeywords.has(kwKey)) {
      reject(`same primary keyword as "${seenKeywords.get(kwKey)}" in this batch`);
      continue;
    }

    if (kwTokens.size >= MIN_KEYWORD_TOKENS) {
      const kwHit = posts.find((p) => covers(p.allTokens, kwTokens));
      if (kwHit) {
        reject(`keyword "${brief.primaryKeyword}" already targeted by /blog/${kwHit.slug}`);
        continue;
      }
      const prKwHit = prs.find((pr) => covers(pr.tokens, kwTokens));
      if (prKwHit) {
        reject(`keyword "${brief.primaryKeyword}" already covered by open PR "${prKwHit.title}"`);
        continue;
      }
    }

    const titleHit = posts.find(
      (p) => jaccard(titleTokens, p.titleTokens) >= TITLE_SIMILARITY_THRESHOLD
    );
    if (titleHit) {
      reject(`title too close to /blog/${titleHit.slug} ("${titleHit.title}")`);
      continue;
    }
    const prTitleHit = prs.find(
      (pr) => jaccard(titleTokens, pr.tokens) >= TITLE_SIMILARITY_THRESHOLD
    );
    if (prTitleHit) {
      reject(`title too close to open PR "${prTitleHit.title}"`);
      continue;
    }

    seenKeywords.set(kwKey, brief.title);
    kept.push(brief);
  }

  return { kept, rejected };
}

/**
 * Titles of every open PR on the repo. Throws when it cannot read them: the
 * gate fails closed, because "could not check" must never pass as "no PRs".
 */
export async function fetchOpenPrTitles(): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN/GITHUB_REPO not set — cannot check open PRs");
  }

  const titles: string[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/pulls?state=open&per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error(`GitHub open-PR read failed: ${res.status}`);
    }
    const batch = (await res.json()) as { title: string }[];
    titles.push(...batch.map((p) => p.title));
    if (batch.length < 100) break;
  }
  return titles;
}
