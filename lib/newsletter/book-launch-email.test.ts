import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildBookLaunchHtml,
  bookPageUrl,
  BOOK_LAUNCH_EMAIL,
  BOOK_LAUNCH_CAMPAIGN,
} from "./book-launch-email";
import { checkIssueHtml } from "./issue-gate";
import { SENDER_POSTAL_ADDRESS } from "@/lib/sender";

const SITE = "https://workagedleads.com";

function hrefs(html: string): string[] {
  return [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

describe("book launch email", () => {
  test("passes the issue gate (the only expected warning is the missing store link)", () => {
    const gate = checkIssueHtml(buildBookLaunchHtml(SITE));
    assert.equal(gate.ok, true, gate.reason);
    for (const w of gate.warnings) assert.match(w, /No agedleadstore\.com link/);
  });

  test("quotes no price and claims no reviews", () => {
    const html = buildBookLaunchHtml(SITE);
    assert.equal(/\$\s*\d/.test(html), false, "no dollar figures");
    assert.equal(/\bstars?\b|\d+\s+reviews/i.test(html), false, "no rating or review count");
  });

  test("links once to /book with campaign UTMs, never straight to Amazon", () => {
    const links = hrefs(buildBookLaunchHtml(SITE)).filter((h) => h.startsWith("http"));
    assert.deepEqual(links, [bookPageUrl(SITE)]);
    const u = new URL(links[0]);
    assert.equal(u.pathname, "/book");
    assert.equal(u.searchParams.get("utm_campaign"), BOOK_LAUNCH_CAMPAIGN);
    assert.equal(u.searchParams.get("utm_content"), `${BOOK_LAUNCH_EMAIL.label}-book`);
  });

  test("review ask offers nothing in return", () => {
    assert.match(BOOK_LAUNCH_EMAIL.ps, /honest review/);
    assert.equal(/free|gift|bonus|in exchange|giveaway/i.test(BOOK_LAUNCH_EMAIL.ps), false);
  });

  test("carries the CAN-SPAM footer", () => {
    const html = buildBookLaunchHtml(SITE);
    assert.ok(html.includes("{{{RESEND_UNSUBSCRIBE_URL}}}"));
    assert.ok(html.includes(SENDER_POSTAL_ADDRESS.split(",")[0]));
  });
});
