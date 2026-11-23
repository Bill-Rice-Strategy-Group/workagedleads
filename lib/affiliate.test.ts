import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  affiliateUrl,
  storeCategoryPath,
  agedLeadLabel,
  isAffiliateDomain,
  tagAffiliateHref,
} from "./affiliate";

describe("isAffiliateDomain", () => {
  test("matches the apex and the storefront subdomain", () => {
    // The partner sells across two hosts. On-site CTAs link to the apex; the
    // newsletter's nine-vertical strip deep-links to
    // store.agedleadstore.com/{segment}/leads. GA4 reports those as two
    // different linkDomain values, so the scoreboard has to accept both.
    assert.equal(isAffiliateDomain("agedleadstore.com"), true);
    assert.equal(isAffiliateDomain("store.agedleadstore.com"), true);
  });

  test("does not match a host that merely ends with the same string", () => {
    // The GA4 query has to use ENDS_WITH because GA4 offers no "this host or a
    // subdomain of it" matcher. This predicate is the precise one, and it is
    // what the leakage roll-up uses.
    assert.equal(isAffiliateDomain("notagedleadstore.com"), false);
    assert.equal(isAffiliateDomain("agedleadstore.com.evil.example"), false);
  });

  test("scores real competitor hosts as not-affiliate", () => {
    // Live leakage destinations from the 2026-09-01 reading — 63 of 150
    // outbound clicks. Deliberate: independent reviews are what make the
    // provider pages worth reading. They must never count as revenue.
    for (const d of ["datatoleads.com", "leadsdata.com", "ileads.com", "agedleadsdepot.com"]) {
      assert.equal(isAffiliateDomain(d), false, d);
    }
  });
});

describe("storeCategoryPath", () => {
  test("resolves a Sanity leadType title — the form every caller actually passes", () => {
    // The bug this replaces looked up a Title Case string in a lowercase-slug
    // map, so it silently missed on all 102 posts that set leadTypes and every
    // affiliate click landed on the generic catalogue.
    assert.equal(storeCategoryPath("Auto Insurance Leads"), "/auto-insurance-leads/");
    assert.equal(storeCategoryPath("Life Insurance Leads"), "/life-insurance-leads/");
    assert.equal(storeCategoryPath("Health Insurance Leads"), "/health-insurance-leads/");
  });

  test("points at the BUY page, never the article that shares its name", () => {
    // The partner publishes an article and a buy page under parallel slugs, so
    // a 200 does not mean a purchase page. /mortgage-leads/ is a tag archive
    // ("Mortgage Leads Archives") and /home-improvement-leads/ is an article.
    // The authority is the "Buy Aged Leads" nav dropdown.
    assert.equal(
      storeCategoryPath("Mortgage Leads"),
      "/mortgage-leads-purchase-refinance/",
    );
    assert.equal(
      storeCategoryPath("Home Improvement Leads"),
      "/buy-home-improvement-leads-lp/",
    );
    assert.equal(
      storeCategoryPath("IUL Leads"),
      "/indexed-universal-life-insurance-leads/",
    );
  });

  test("final expense follows the partner's own menu onto life insurance", () => {
    // Looks wrong, is right: their dropdown points Final Expense Leads at
    // /life-insurance-leads/, because final expense is life insurance.
    assert.equal(storeCategoryPath("Final Expense Leads"), "/life-insurance-leads/");
  });

  test("attorney-intake products share the legal category", () => {
    // Not sold by the partner since 2026-11-23 (Bill): no buy page at all.
    assert.equal(storeCategoryPath("MVA Leads"), undefined);
    assert.equal(storeCategoryPath("SSDI Leads"), undefined);
  });

  test("verticals the partner does not sell fall back to the catalogue", () => {
    // Medicare and solar are a BUSINESS decision — Troy is not selling either
    // right now (confirmed 2026-08-06), so the catalogue is the intended
    // destination, not a stopgap. "Insurance Leads" is unmapped because no
    // generic-insurance buy page exists. In every case the catalogue sells;
    // the identically-named articles do not.
    for (const t of ["Medicare Leads", "Solar Leads", "Insurance Leads"]) {
      assert.equal(storeCategoryPath(t), undefined, t);
    }
    assert.equal(
      affiliateUrl({ path: storeCategoryPath("Medicare Leads"), campaign: "c", content: "x" }),
      affiliateUrl({ campaign: "c", content: "x" }),
    );
  });

  test("accepts a slug or a bare vertical, so old call sites keep working", () => {
    assert.equal(
      storeCategoryPath("mortgage-leads"),
      "/mortgage-leads-purchase-refinance/",
    );
    assert.equal(storeCategoryPath("mortgage"), "/mortgage-leads-purchase-refinance/");
    assert.equal(storeCategoryPath("home-services"), "/buy-home-improvement-leads-lp/");
    assert.equal(storeCategoryPath("auto"), "/auto-insurance-leads/");
  });

  test("missing or unknown input is undefined, never a guessed path", () => {
    for (const v of [undefined, null, "", "   ", "Underwater Basket Leads"]) {
      assert.equal(storeCategoryPath(v), undefined, `${JSON.stringify(v)}`);
    }
  });
});

describe("agedLeadLabel", () => {
  test("does not double the word 'leads'", () => {
    // Shipped as "aged Mortgage Leads leads" on ~102 published posts.
    assert.equal(agedLeadLabel("Mortgage Leads"), "aged mortgage leads");
    assert.equal(agedLeadLabel("Auto Insurance Leads"), "aged auto insurance leads");
  });

  test("keeps acronyms upper-case", () => {
    assert.equal(agedLeadLabel("IUL Leads"), "aged IUL leads");
    assert.equal(agedLeadLabel("MVA Leads"), "aged MVA leads");
    assert.equal(agedLeadLabel("SSDI Leads"), "aged SSDI leads");
  });

  test("handles slugs and stray whitespace", () => {
    assert.equal(agedLeadLabel("final-expense-leads"), "aged final expense leads");
    assert.equal(agedLeadLabel("  Solar Leads  "), "aged solar leads");
  });

  test("falls back to the generic label rather than emitting 'aged  leads'", () => {
    for (const v of [undefined, null, "", "   ", "Leads"]) {
      assert.equal(agedLeadLabel(v), "aged leads", `${JSON.stringify(v)}`);
    }
  });
});

describe("affiliateUrl", () => {
  test("keeps the UTM contract intact and defaults to the full catalogue", () => {
    const u = new URL(affiliateUrl({ campaign: "lead-type", content: "mortgage-leads" }));
    assert.equal(u.origin + u.pathname, "https://agedleadstore.com/all-lead-types/");
    assert.equal(u.searchParams.get("utm_source"), "workagedleads");
    assert.equal(u.searchParams.get("utm_medium"), "affiliate");
    assert.equal(u.searchParams.get("utm_campaign"), "lead-type");
    assert.equal(u.searchParams.get("utm_content"), "mortgage-leads");
  });

  test("a resolved category path replaces the catalogue path, not the params", () => {
    const u = new URL(
      affiliateUrl({
        path: storeCategoryPath("Health Insurance Leads"),
        campaign: "lead-type",
        content: "health-insurance-leads",
      }),
    );
    assert.equal(u.pathname, "/health-insurance-leads/");
    assert.equal(u.searchParams.get("utm_source"), "workagedleads");
  });
});

describe("tagAffiliateHref", () => {
  test("tags a bare partner link pasted into a post body", () => {
    const out = new URL(tagAffiliateHref("https://www.agedleadstore.com/", "blog-post", "body-link"));
    assert.equal(out.hostname, "www.agedleadstore.com");
    assert.equal(out.searchParams.get("utm_source"), "workagedleads");
    assert.equal(out.searchParams.get("utm_medium"), "affiliate");
    assert.equal(out.searchParams.get("utm_campaign"), "blog-post");
    assert.equal(out.searchParams.get("utm_content"), "body-link");
  });

  test("overwrites another site's source but keeps the editor's campaign", () => {
    const out = new URL(
      tagAffiliateHref(
        "https://agedleadstore.com/all-lead-types/?utm_source=howtoworkleads&utm_medium=blog&utm_campaign=close-crm-review",
        "blog-post",
        "body-link"
      )
    );
    assert.equal(out.searchParams.get("utm_source"), "workagedleads");
    assert.equal(out.searchParams.get("utm_medium"), "affiliate");
    assert.equal(out.searchParams.get("utm_campaign"), "close-crm-review");
    assert.equal(out.searchParams.get("utm_content"), "body-link");
  });

  test("leaves a fully tagged link's campaign and content alone", () => {
    const href =
      "https://agedleadstore.com/life-insurance-leads/?utm_source=workagedleads&utm_medium=affiliate&utm_campaign=blog-70-dials-nobody-answers&utm_content=body-weekly-restock";
    assert.equal(tagAffiliateHref(href, "blog-post", "body-link"), href);
  });

  test("tags the storefront subdomain too", () => {
    const out = new URL(tagAffiliateHref("https://store.agedleadstore.com/mortgage/leads", "blog-post", "body-link"));
    assert.equal(out.searchParams.get("utm_source"), "workagedleads");
  });

  test("does not touch other hosts, relative links or junk", () => {
    for (const h of ["https://datatoleads.com/", "/providers", "mailto:a@b.co", "not a url", "https://notagedleadstore.com/"]) {
      assert.equal(tagAffiliateHref(h, "blog-post", "body-link"), h, h);
    }
  });
});
