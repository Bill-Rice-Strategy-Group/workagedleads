/**
 * Publish "70 Dials a Day and Nobody Answers: Let Email Decide Who You Call".
 *
 * WHY (2026-11-12)
 *
 * Built from a real reader letter (anonymized, paraphrased by Bill's decision):
 * a final expense agent whose contact rate collapsed. The piece is the featured
 * article for the 2026-11-17 newsletter, whose calendar entry names this slug,
 * so it must be live before the Sunday 2026-11-15 14:00 UTC draft run.
 *
 * Creates a NEW post. Refuses to overwrite an existing document with this _id
 * unless --replace is passed. --replace patches title/excerpt/seo/body only,
 * so the featured image and publishedAt survive.
 *
 * DRY RUN BY DEFAULT.
 *   npx tsx --env-file=.env.local scripts/publish-nobody-answers-2026-11-12.ts
 *   npx tsx --env-file=.env.local scripts/publish-nobody-answers-2026-11-12.ts --apply
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "../lib/markdown-to-portabletext.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DRAFT = join(REPO_ROOT, "content", "drafts-2026-11-12", "01-nobody-answers", "draft.md");

const SLUG = "70-dials-nobody-answers-email-decides-who-you-call";
const DOC_ID = `post-${SLUG}`;
const APPLY = process.argv.includes("--apply");
const REPLACE = process.argv.includes("--replace");

const META_TITLE = "70 Dials, Nobody Answers: Let Email Pick Who You Call";
const META_DESCRIPTION =
  "Aged leads stopped answering? Check your number for a spam label, let email pick who you call, and work a shorter week. A guide for insurance agents.";

function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[kv[1]] = val;
  }
  return { data, body: m[2] };
}

const key = () => Math.random().toString(36).slice(2, 10);
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");

  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!token) throw new Error("Missing SANITY_API_TOKEN");

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });

  const { data, body } = parseFrontmatter(readFileSync(DRAFT, "utf8"));
  if (data.slug !== SLUG) throw new Error(`Draft slug "${data.slug}" != ${SLUG}`);
  if (META_TITLE.length > 60) throw new Error(`metaTitle is ${META_TITLE.length} chars`);
  if (META_DESCRIPTION.length > 160) throw new Error(`metaDescription is ${META_DESCRIPTION.length} chars`);

  // Guards on the things this piece must and must not carry.
  for (const needle of [
    "freecallerregistry.com",
    "mailchimp.com/legal/acceptable_use",
    "ecfr.gov",
    "iga.in.gov",
    "agedleadstore.com/life-insurance-leads/",
    "we earn a commission",
  ]) {
    if (!body.includes(needle)) throw new Error(`Draft is missing required marker "${needle}"`);
  }
  for (const banned of ["Open questions", "Ringy", "Radiusbob", "AgencyBloc", "Dutka", "Valparaiso"]) {
    if (body.includes(banned)) throw new Error(`Draft still contains "${banned}"`);
  }

  const blocks = markdownToPortableText(body.replace(/^\s*#\s+.+?\n/, ""));
  if (blocks.length < 30) throw new Error(`Only ${blocks.length} blocks — looks wrong`);
  const tables = blocks.filter((b) => b._type === "table").length;

  const existing = await client.fetch(`*[_id == $id][0]{_id, title}`, { id: DOC_ID });
  if (existing && !REPLACE) {
    throw new Error(`${DOC_ID} already exists ("${existing.title}"). Pass --replace to overwrite.`);
  }

  const doc = {
    _id: DOC_ID,
    _type: "post" as const,
    title: data.title,
    slug: { _type: "slug" as const, current: SLUG },
    excerpt: data.excerpt,
    publishedAt: new Date().toISOString(),
    contentType: "cluster" as const,
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-strategies")],
    leadTypes: [ref("lt-final-expense"), ref("lt-insurance")],
    seo: { metaTitle: META_TITLE, metaDescription: META_DESCRIPTION },
    body: blocks,
  };

  console.log(`id         ${DOC_ID}${existing ? "  (REPLACING)" : "  (new)"}`);
  console.log(`title      ${doc.title}`);
  console.log(`body       ${blocks.length} blocks, ${tables} table(s)`);
  console.log(`meta       ${META_TITLE.length}-char title, ${META_DESCRIPTION.length}-char description`);

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }
  if (existing) {
    // Patch copy only. createOrReplace would drop mainImage (added afterwards by
    // generate-featured-images.mjs) and reset publishedAt.
    await client
      .patch(DOC_ID)
      .set({ title: doc.title, excerpt: doc.excerpt, seo: doc.seo, body: doc.body })
      .commit();
    console.log(`\npatched ${DOC_ID} — title, excerpt, seo, body only`);
    return;
  }
  await client.createOrReplace(doc);
  console.log(`\npublished ${DOC_ID}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
