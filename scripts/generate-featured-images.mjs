#!/usr/bin/env node
/**
 * Generate branded featured images for agedleadsales.com posts and playbooks.
 *
 * Searches Unsplash for professional photos (with people), applies a
 * semi-transparent blue (#2563eb) gradient overlay with title text,
 * uploads to Sanity, and patches the document's mainImage field.
 *
 * Usage:
 *   node scripts/generate-featured-images.mjs              # all missing
 *   node scripts/generate-featured-images.mjs --dry-run    # preview only
 *   node scripts/generate-featured-images.mjs --limit 3    # first N
 *   node scripts/generate-featured-images.mjs --replace    # replace existing
 *   node scripts/generate-featured-images.mjs --ids "id1,id2"  # specific docs
 *   node scripts/generate-featured-images.mjs --ids "id1" --photo-id <unsplashId>
 *     # use a hand-picked Unsplash photo instead of the title-keyword search,
 *     # for when the automatic pick doesn't fit the piece. One doc at a time.
 *
 * Requires: UNSPLASH_ACCESS_KEY, SANITY_API_TOKEN in .env.local
 * Dependencies: sharp, @sanity/client, dotenv
 */
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

import { createClient } from "@sanity/client";
import sharp from "sharp";

// ── Config ────────────────────────────────────────────────────────────

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!UNSPLASH_ACCESS_KEY) {
  console.error("Missing UNSPLASH_ACCESS_KEY in .env.local");
  process.exit(1);
}
if (!SANITY_TOKEN) {
  console.error("Missing SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2026-03-14",
  useCdn: false,
  token: SANITY_TOKEN,
});

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630; // OG image standard
const BRAND_BLUE = "#2563eb";
const BRAND_BLUE_RGB = { r: 37, g: 99, b: 235 };
const UNSPLASH_DELAY_MS = 1500; // Rate limit: 50 req/hr for demo apps

// ── Unsplash search & scoring ─────────────────────────────────────────

/**
 * Search Unsplash for professional photographs featuring people.
 * Fetches 20 candidates, scores each, returns the best match.
 */
async function searchUnsplash(query) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });

  if (!res.ok) {
    console.error(`  Unsplash API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const photos = data.results || [];
  if (photos.length === 0) return null;

  // Score each photo — prefer real photographs with people
  const scored = photos.map((photo) => ({
    photo,
    score: scorePhoto(photo),
  }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  console.log(`   Best photo score: ${best.score} (of ${photos.length} candidates)`);
  if (best.photo.alt_description) {
    console.log(`   Alt: "${best.photo.alt_description}"`);
  }

  // Trigger Unsplash download endpoint (required by API guidelines)
  fetch(best.photo.links.download_location, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  }).catch(() => {});

  return best.photo;
}

/** Fetch one hand-picked Unsplash photo by id (and register the download). */
async function getUnsplashPhoto(id) {
  const res = await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });
  if (!res.ok) {
    console.error(`  Unsplash API error: ${res.status} ${res.statusText}`);
    return null;
  }
  const photo = await res.json();
  console.log(`   Hand-picked photo ${id}: "${photo.alt_description ?? ""}"`);
  fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  }).catch(() => {});
  return photo;
}

/**
 * Score a photo for "real photograph with people in professional setting".
 * Higher = better. Penalizes graphics, text, illustrations.
 */
function scorePhoto(photo) {
  let score = 0;
  const text = [
    photo.description || "",
    photo.alt_description || "",
    ...(photo.tags?.map((t) => t.title) || []),
  ]
    .join(" ")
    .toLowerCase();

  // Boost: people-related keywords
  const peopleWords = [
    "person", "people", "woman", "man", "team", "group", "meeting",
    "professional", "business", "office", "working", "conference",
    "entrepreneur", "executive", "colleague", "coworker", "handshake",
    "laptop", "desk", "suit", "portrait", "discussion", "collaboration",
    "phone", "call", "calling", "headset", "sales", "agent",
  ];
  for (const word of peopleWords) {
    if (text.includes(word)) score += 3;
  }

  // Boost: professional/business environment
  const proWords = [
    "corporate", "workplace", "startup", "boardroom", "presentation",
    "strategy", "finance", "technology", "modern", "consulting",
    "insurance", "mortgage", "real estate", "leads", "crm",
  ];
  for (const word of proWords) {
    if (text.includes(word)) score += 2;
  }

  // Penalize: graphics, text, illustrations, screenshots
  const penaltyWords = [
    "illustration", "icon", "graphic", "vector", "flat", "cartoon",
    "text", "letter", "word", "typography", "font", "sign", "logo",
    "screenshot", "screen", "mockup", "template", "banner", "poster",
    "abstract", "pattern", "texture", "background", "wallpaper",
    "drawing", "sketch", "clipart", "infographic", "diagram", "chart",
  ];
  for (const word of penaltyWords) {
    if (text.includes(word)) score -= 5;
  }

  // Strong boost if alt_description mentions a person directly
  const alt = (photo.alt_description || "").toLowerCase();
  if (/\b(man|woman|person|people|team|group)\b/.test(alt)) {
    score += 5;
  }

  return score;
}

/**
 * Build an Unsplash search query from post title.
 * Always includes "people professional" to bias toward real people photos.
 */
function buildSearchQuery(title, docType) {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "how", "what", "why", "when", "who", "which", "that", "this", "your",
    "their", "should", "about", "into", "through", "during", "before",
    "after", "above", "below", "between", "same", "than", "too", "very",
    "can", "will", "just", "don", "should", "now", "also", "do", "does",
    "complete", "guide", "ultimate", "best", "top", "step",
  ]);

  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Take top 2 substantive words from the title
  const keywords = [...titleWords.slice(0, 2)];

  // Add context based on document type
  const contextWord = docType === "playbook" ? "strategy" : "sales";
  if (!keywords.includes(contextWord)) keywords.push(contextWord);

  // Always append to get photographs of real people
  keywords.push("people", "professional");

  return keywords.join(" ");
}

// ── Image processing ──────────────────────────────────────────────────

/**
 * Create the blue gradient overlay as an SVG buffer.
 * Semi-transparent blue gradient from bottom-left, covering ~60% of the image.
 */
function createBlueGradientOverlay(width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${BRAND_BLUE};stop-opacity:0.85"/>
        <stop offset="50%" style="stop-color:${BRAND_BLUE};stop-opacity:0.6"/>
        <stop offset="100%" style="stop-color:${BRAND_BLUE};stop-opacity:0.25"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#blueGrad)"/>
  </svg>`;
  return Buffer.from(svg);
}

/**
 * Create a text overlay with the post title as white text.
 * Uses SVG foreignObject for text wrapping support.
 */
function createTitleOverlay(width, height, title) {
  // Determine font size based on title length
  let fontSize = 48;
  if (title.length > 60) fontSize = 36;
  if (title.length > 90) fontSize = 30;

  const padding = 80;
  const textWidth = width - padding * 2;
  const textY = height - 200; // Position in lower third

  // Escape HTML entities in title
  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      .title {
        font-family: Arial, Helvetica, sans-serif;
        font-size: ${fontSize}px;
        font-weight: 700;
        fill: white;
        line-height: 1.2;
      }
    </style>
    <text class="title" x="${padding}" y="${textY}" width="${textWidth}">
      ${wrapSvgText(safeTitle, fontSize, textWidth, padding, textY)}
    </text>
  </svg>`;
  return Buffer.from(svg);
}

/**
 * Wrap text into multiple <tspan> elements for SVG rendering.
 */
function wrapSvgText(text, fontSize, maxWidth, x, startY) {
  // Approximate character width at ~0.55 of font size for Arial Bold
  const charWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);
  const lineHeight = fontSize * 1.3;

  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Adjust starting Y upward so text block is vertically centered in lower area
  const totalHeight = lines.length * lineHeight;
  const adjustedStartY = startY - totalHeight + lineHeight;

  return lines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`)
    .join("\n      ");
}

/**
 * Create a subtle white dot pattern overlay (brand texture element).
 */
function createDotPattern(width, height) {
  const dotRadius = 2;
  const spacing = 48;
  const startY = Math.floor(height * 0.1);
  const endY = Math.floor(height * 0.45);

  const circles = [];
  for (let y = startY; y < endY; y += spacing) {
    for (let x = 20; x < width; x += spacing) {
      circles.push(`<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="white" opacity="0.15"/>`);
    }
  }

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${circles.join("")}</svg>`
  );
}

/**
 * Process: download photo -> apply blue gradient + title text -> output JPEG buffer.
 */
async function generateBrandedImage(photo, title) {
  // Download at optimal size, crop to faces
  const downloadUrl = `${photo.urls.raw}&w=${IMAGE_WIDTH}&h=${IMAGE_HEIGHT}&fit=crop&crop=faces,center&q=80`;
  const res = await fetch(downloadUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const rawBuffer = Buffer.from(await res.arrayBuffer());

  // Create overlay layers
  const blueGradient = createBlueGradientOverlay(IMAGE_WIDTH, IMAGE_HEIGHT);
  const dotPattern = createDotPattern(IMAGE_WIDTH, IMAGE_HEIGHT);
  const titleOverlay = createTitleOverlay(IMAGE_WIDTH, IMAGE_HEIGHT, title);

  // Composite: photo -> blue gradient -> dot pattern -> title text
  const buffer = await sharp(rawBuffer)
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "centre" })
    .composite([
      { input: blueGradient, blend: "over" },
      { input: dotPattern, blend: "over" },
      { input: titleOverlay, blend: "over" },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();

  return buffer;
}

// ── Helpers ───────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const replace = args.includes("--replace");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 999;
  const idsIdx = args.indexOf("--ids");
  const idFilter = idsIdx >= 0 ? args[idsIdx + 1].split(",") : null;
  const photoIdIdx = args.indexOf("--photo-id");
  const photoId = photoIdIdx >= 0 ? args[photoIdIdx + 1] : null;
  if (photoId && (!idFilter || idFilter.length !== 1)) {
    throw new Error("--photo-id needs exactly one document via --ids");
  }

  console.log(`\nGenerating featured images for agedleadsales.com`);
  console.log(`Brand: Blue (#2563eb) gradient overlay + title text`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}${replace ? " (replacing existing)" : ""}\n`);

  // ── Query Sanity for posts/playbooks needing images ──
  let query;
  let params;

  if (idFilter) {
    query = `*[_type in ["post", "playbook"] && _id in $ids]{
      _id, title, _type
    }`;
    params = { ids: idFilter };
  } else if (replace) {
    query = `*[_type in ["post", "playbook"]] | order(_type asc, publishedAt desc) [0...$limit]{
      _id, title, _type
    }`;
    params = { limit };
  } else {
    query = `*[_type in ["post", "playbook"] && !defined(mainImage)] | order(_type asc, publishedAt desc) [0...$limit]{
      _id, title, _type
    }`;
    params = { limit };
  }

  const docs = await client.fetch(query, params);
  console.log(`Found ${docs.length} documents to process.\n`);

  if (docs.length === 0) {
    console.log("Nothing to do! All posts/playbooks have featured images.");
    return;
  }

  // List them
  for (const doc of docs) {
    console.log(`  [${doc._type}] ${doc.title}`);
  }
  console.log("");

  if (dryRun) {
    console.log("[DRY RUN] Would generate and upload images for the above documents.");
    return;
  }

  let success = 0;
  let failed = 0;

  for (const doc of docs) {
    const searchQuery = buildSearchQuery(doc.title, doc._type);

    console.log(`--- ${doc._type}: ${doc.title}`);
    console.log(`    Unsplash query: "${searchQuery}"`);

    try {
      // Search Unsplash
      let photo = photoId ? await getUnsplashPhoto(photoId) : await searchUnsplash(searchQuery);
      if (photoId && !photo) {
        console.log(`    FAILED: Unsplash photo ${photoId} not found\n`);
        failed++;
        continue;
      }
      if (!photo) {
        console.log(`    No results, trying fallback "people in an office setting"...`);
        photo = await searchUnsplash("people in an office setting professional");
        if (!photo) {
          console.log(`    FAILED: No image found, skipping\n`);
          failed++;
          continue;
        }
      }

      // Generate branded image with blue overlay + title
      const buffer = await generateBrandedImage(photo, doc.title);
      console.log(`    Image generated (${Math.round(buffer.length / 1024)}KB)`);

      // Upload to Sanity
      const asset = await client.assets.upload("image", buffer, {
        filename: `featured-${slugify(doc.title)}.jpg`,
        contentType: "image/jpeg",
      });
      console.log(`    Uploaded: ${asset._id}`);

      // Patch the document
      await client
        .patch(doc._id)
        .set({
          mainImage: {
            _type: "image",
            alt: doc.title,
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .commit();

      console.log(`    DONE -- Photo by ${photo.user.name}`);
      console.log(`    ${photo.user.links.html}\n`);
      success++;

      // Rate limit delay
      await delay(UNSPLASH_DELAY_MS);
    } catch (err) {
      console.error(`    ERROR: ${err instanceof Error ? err.message : err}\n`);
      failed++;
    }
  }

  console.log(`\nComplete! ${success} succeeded, ${failed} failed.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
