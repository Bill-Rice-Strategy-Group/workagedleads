import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  BOOK_CHANGES,
  BOOK_SECTIONS,
  NEVER_LIST,
  SPREADSHEET_TEMPLATE,
  formatMonthYear,
  isPublishable,
  isStale,
} from "./book-guide";

test("a section goes stale six months after it was checked", () => {
  assert.equal(isStale("2026-05", new Date("2026-10-31T12:00:00Z")), false);
  assert.equal(isStale("2026-05", new Date("2026-11-01T12:00:00Z")), true);
  assert.equal(isStale("2026-11", new Date("2027-04-30T12:00:00Z")), false);
  assert.equal(isStale("2026-11", new Date("2027-05-01T12:00:00Z")), true);
});

test("formats the stamp as Month Year", () => {
  assert.equal(formatMonthYear("2026-11"), "November 2026");
  assert.equal(formatMonthYear("2027-01"), "January 2027");
});

test("section ids are unique, anchor-safe and include the printed set", () => {
  const ids = BOOK_SECTIONS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9-]+$/);
  // Anchors may be linked from print or email. Removing one breaks a link.
  for (const id of [
    "start-here",
    "never-list",
    "build-the-list",
    "house-rules",
    "today-page",
    "email-series",
    "call-brief",
    "promises",
    "permission-to-text",
    "referral-moments",
    "long-list",
    "sort-the-week",
  ]) {
    assert.ok(ids.includes(id), `missing permanent anchor #${id}`);
  }
});

test("every ready section has a valid Last checked stamp", () => {
  for (const s of BOOK_SECTIONS.filter((x) => x.status === "ready")) {
    assert.ok(s.lastChecked, `${s.id} is ready with no lastChecked`);
    assert.doesNotThrow(() => formatMonthYear(s.lastChecked!));
  }
});

test("no compliance section is publishable without a recorded legal review", () => {
  for (const s of BOOK_SECTIONS.filter((x) => x.needsLegalReview)) {
    if (!s.legalReviewedOn) {
      assert.equal(isPublishable(s), false, `${s.id} would publish without legal review`);
    }
  }
  // The texting section is the one that can hurt a reader most if it is wrong.
  const texting = BOOK_SECTIONS.find((s) => s.id === "permission-to-text")!;
  assert.equal(texting.needsLegalReview, true);
});

test("the never list is the appendix text, unchanged", () => {
  assert.equal(NEVER_LIST.lead, "The machine is never allowed to:");
  assert.deepEqual(
    NEVER_LIST.lines.map((l) => l.bold + l.rest),
    [
      "Pretend to be you on the phone. No AI voices, no clones, no robots calling people.",
      "Text anyone who hasn't given you permission directly, and recorded when and how.",
      "Send anything you haven't read.",
      "Decide who is worth calling without you looking. It can sort; you decide.",
      "Make a promise you didn't make.",
    ],
  );
  assert.equal(NEVER_LIST.sixth, "6. Be the reason somebody stops answering their phone.");
});

test("changelog is newest first with valid dates", () => {
  const dates = BOOK_CHANGES.map((c) => c.date);
  for (const d of dates) assert.match(d, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual([...dates].sort().reverse(), dates);
  const ids = new Set(BOOK_SECTIONS.map((s) => s.id));
  for (const c of BOOK_CHANGES) if (c.section) assert.ok(ids.has(c.section));
});

test("the spreadsheet template files exist", () => {
  for (const href of [SPREADSHEET_TEMPLATE.href, SPREADSHEET_TEMPLATE.csvHref]) {
    assert.ok(existsSync(join(process.cwd(), "public", href)), `missing ${href}`);
  }
});
