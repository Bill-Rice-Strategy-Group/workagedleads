import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildFinish2026Html,
  finish2026Active,
  FINISH2026_CAMPAIGN,
  FINISH2026_CODE,
  FINISH2026_EMAILS,
} from "./finish2026";
import { checkIssueHtml } from "./issue-gate";
import { SENDER_POSTAL_ADDRESS } from "@/lib/sender";

const SITE = "https://workagedleads.com";

function urls(html: string): URL[] {
  return [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map(
    (m) => new URL(m[1].replace(/&amp;/g, "&")),
  );
}

function text(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

const ALL = FINISH2026_EMAILS.map((e) => [e.key, e] as const);

describe("FINISH2026 campaign emails", () => {
  test("every email passes the gate the send path re-runs", () => {
    for (const [key, email] of ALL) {
      const gate = checkIssueHtml(buildFinish2026Html(email, SITE));
      assert.equal(gate.ok, true, `${key}: ${gate.reason}`);
    }
  });

  test("none quotes a dollar price", () => {
    for (const [key, email] of ALL) {
      assert.equal(/\$\s*\d/.test(buildFinish2026Html(email, SITE)), false, key);
    }
  });

  test("every email shows the code, in the subject or preview too", () => {
    for (const [key, email] of ALL) {
      assert.ok(text(buildFinish2026Html(email, SITE)).includes(FINISH2026_CODE), `${key}: code missing from body`);
      assert.ok(
        `${email.subject} ${email.previewText}`.includes(FINISH2026_CODE),
        `${key}: code missing from subject and preview`,
      );
    }
  });

  test("none says or implies the code expires — it does not (confirmed 2026-11-17)", () => {
    const expiry = [
      /ends?/i,
      /expir/i,
      /last (?:day|chance)/i,
      /through (?:monday|november|nov\b)/i,
      /stops? working/i,
      /deadline/i,
      /only until/i,
      /while it lasts/i,
    ];
    for (const [key, email] of ALL) {
      const all = `${email.subject} ${email.previewText} ${text(buildFinish2026Html(email, SITE))}`;
      for (const re of expiry) assert.equal(re.test(all), false, `${key} matched ${re}`);
    }
  });

  test("every store link is tagged with this campaign and a distinct utm_content", () => {
    const all: string[] = [];
    for (const [key, email] of ALL) {
      const store = urls(buildFinish2026Html(email, SITE)).filter((u) =>
        u.hostname.endsWith("agedleadstore.com"),
      );
      assert.ok(store.length >= 9, `${key}: expected the vertical buttons`);
      for (const u of store) {
        assert.equal(u.searchParams.get("utm_source"), "workagedleads", u.href);
        assert.equal(u.searchParams.get("utm_medium"), "email", u.href);
        assert.equal(u.searchParams.get("utm_campaign"), FINISH2026_CAMPAIGN, u.href);
        const c = u.searchParams.get("utm_content") ?? "";
        assert.ok(c.startsWith(`${email.label}-${key}-`), `${key}: ${c}`);
        all.push(c);
      }
    }
    assert.equal(new Set(all).size, all.length, "duplicate utm_content across the campaign");
  });

  test("sends are in order and never on the Tuesday newsletter slot", () => {
    let prev = "";
    for (const [key, email] of ALL) {
      assert.ok(email.label > prev, `${key} out of order`);
      assert.notEqual(new Date(`${email.label}T00:00:00Z`).getUTCDay(), 2, `${key} lands on a Tuesday`);
      prev = email.label;
    }
  });

  test("none invents scarcity", () => {
    const scarcity = [
      /\blimited\b/i,
      /\bhurry\b/i,
      /\bwhile (?:supplies|stocks?) last\b/i,
      /\bselling out\b/i,
      /\balmost gone\b/i,
      /\bonly \d+ left\b/i,
    ];
    for (const [key, email] of ALL) {
      const body = text(buildFinish2026Html(email, SITE));
      for (const re of scarcity) assert.equal(re.test(body), false, `${key} matched ${re}`);
    }
  });

  test("none narrates the send sequence", () => {
    const leaks = [/\bin case you missed\b/i, /\breminder\b/i, /\bmy (?:last|previous) (?:email|note)\b/i, /\bthis email\b/i];
    for (const [key, email] of ALL) {
      const body = text(buildFinish2026Html(email, SITE));
      for (const re of leaks) assert.equal(re.test(body), false, `${key} matched ${re}`);
    }
  });

  test("none makes a first-person claim about buying leads", () => {
    const claims = [/\bI buy\b/i, /\bI order\b/i, /\bI purchase\b/i, /\bmy (?:lead )?(?:orders?|supplier)\b/i];
    for (const [key, email] of ALL) {
      const html = buildFinish2026Html(email, SITE);
      for (const re of claims) assert.equal(re.test(html), false, `${key} matched ${re}`);
    }
  });

  test("each discloses the affiliate relationship, briefly", () => {
    for (const [key, email] of ALL) {
      const html = buildFinish2026Html(email, SITE);
      assert.match(html, /at no cost to you/i, key);
      assert.ok((html.match(/affiliate/gi) ?? []).length <= 3, key);
    }
  });

  test("each carries the postal address and the unsubscribe tag", () => {
    for (const [key, email] of ALL) {
      const html = buildFinish2026Html(email, SITE);
      assert.ok(html.includes(SENDER_POSTAL_ADDRESS), key);
      assert.ok(html.includes("{{{RESEND_UNSUBSCRIBE_URL}}}"), key);
    }
  });

  test("site links come from the passed origin", () => {
    for (const [key, email] of ALL) {
      const html = buildFinish2026Html(email, "https://example.test");
      assert.equal(html.includes("workagedleads.com/"), false, `${key} hardcodes a host`);
      assert.ok(html.includes("https://example.test/calculators"), key);
    }
  });
});

describe("finish2026Active", () => {
  test("site bar shows through Dec 31 in US Eastern, off after", () => {
    assert.equal(finish2026Active(new Date("2026-11-18T12:00:00Z")), true);
    assert.equal(finish2026Active(new Date("2027-01-01T04:30:00Z")), true, "still Dec 31 in New York");
    assert.equal(finish2026Active(new Date("2027-01-01T05:00:00Z")), false);
  });
});
