/**
 * Publish "Aged Leads Aren't Leads. They're a Customer Database. Here's How to Let AI Work It."
 *
 * WHY (2026-11-18)
 *
 * Bill's idea: treat aged leads as a buyable customer database, worked by a
 * $20 Claude/ChatGPT assistant connected to a Google Sheet, Gmail and a free
 * booking link. Reviewed by Bill in a Claude Doc on 2026-11-18 (dollar-a-name
 * figure kept, steady-pace framing, booking link added). Featured article for
 * the 2026-12-01 newsletter, whose calendar entry names this slug, so it must
 * be live before the Sunday 2026-11-29 14:00 UTC draft run.
 *
 * Creates a NEW post. Refuses to overwrite an existing document with this _id
 * unless --replace is passed. --replace patches title/excerpt/seo/body only,
 * so the featured image and publishedAt survive.
 *
 * DRY RUN BY DEFAULT.
 *   npx tsx --env-file=.env.local scripts/publish-aged-leads-database-2026-11-18.ts
 *   npx tsx --env-file=.env.local scripts/publish-aged-leads-database-2026-11-18.ts --apply
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "../lib/markdown-to-portabletext.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DRAFT = join(REPO_ROOT, "content", "drafts-2026-11-18", "01-aged-leads-are-a-database", "draft.md");

const SLUG = "aged-leads-customer-database-ai-assistant";
const DOC_ID = `post-${SLUG}`;
const APPLY = process.argv.includes("--apply");
const REPLACE = process.argv.includes("--replace");

const META_TITLE = "Aged Leads Are a Database: Let a $20 AI Assistant Work It";
const META_DESCRIPTION =
  "Stop treating aged leads like fresh leads. Treat them as a customer database and let Claude or ChatGPT write each one a personal email. Simple setup.";

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

  const parsed = parseFrontmatter(readFileSync(DRAFT, "utf8"));
  const data = parsed.data;
  // The draft carries an editor's note in an HTML comment; it never ships.
  const body = parsed.body.replace(/<!--[\s\S]*?-->\s*/g, "");
  if (data.slug !== SLUG) throw new Error(`Draft slug "${data.slug}" != ${SLUG}`);
  if (META_TITLE.length > 60) throw new Error(`metaTitle is ${META_TITLE.length} chars`);
  if (META_DESCRIPTION.length > 160) throw new Error(`metaDescription is ${META_DESCRIPTION.length} chars`);

  // Guards on the things this piece must and must not carry.
  for (const needle of [
    "ftc.gov/business-guidance/resources/can-spam",
    "henson-legal.com",
    "Mode A",
    "/blog/scheduling-links-book-calls-capture-consent",
    "agedleadstore.com/all-lead-types/",
    "utm_campaign=blog-aged-leads-customer-database",
    "we earn a commission",
  ]) {
    if (!body.includes(needle)) throw new Error(`Draft is missing required marker "${needle}"`);
  }
  for (const banned of ["<!--", "DRAFT,", "Ahrefs", "Grow slowly", "Go slow at first"]) {
    if (body.includes(banned)) throw new Error(`Draft still contains "${banned}"`);
  }

  const blocks = markdownToPortableText(body.replace(/^\s*#\s+.+?\n/, ""));
  if (blocks.length < 60) throw new Error(`Only ${blocks.length} blocks — looks wrong`);
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
    categories: [ref("cat-strategies"), ref("cat-scripts")],
    leadTypes: [ref("lt-mortgage"), ref("lt-insurance"), ref("lt-home-improvement")],
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
