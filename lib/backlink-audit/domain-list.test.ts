import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseDomainList, normalizeDomain, DomainListError } from "./domain-list";

describe("parseDomainList — plain one-domain-per-line input", () => {
  test("reads brsg-link-audit's disavow-domains.txt shape", () => {
    const text = "2x9.co\naustralianwebdirectory.shop\nbureatag.com\n";
    assert.deepEqual(parseDomainList(text), [
      "2x9.co",
      "australianwebdirectory.shop",
      "bureatag.com",
    ]);
  });

  test("skips blank lines and # comments, whole-line or trailing", () => {
    const text = "# pulled 2026-11-18\n\nseogear.shop  # farm\n   \nfoo.com\n";
    assert.deepEqual(parseDomainList(text), ["seogear.shop", "foo.com"]);
  });

  test("accepts domain: lines so a Google disavow file can be fed back in", () => {
    const text = "# Disavow file\ndomain:rank-seo-now.shop\ndomain:citegist.com\n";
    assert.deepEqual(parseDomainList(text), ["rank-seo-now.shop", "citegist.com"]);
  });

  test("normalizes case, scheme, www, path, port and trailing dot; dedupes", () => {
    const text = "WWW.Example.com\nhttps://example.com/some/page\nexample.com.\nexample.com:443\nsub.example.co.uk\n";
    assert.deepEqual(parseDomainList(text), ["example.com", "sub.example.co.uk"]);
  });

  test("handles CRLF line endings and a BOM", () => {
    assert.deepEqual(parseDomainList("﻿a.com\r\nb.org\r\n"), ["a.com", "b.org"]);
  });

  test("empty input -> empty list (caller decides whether that is an error)", () => {
    assert.deepEqual(parseDomainList("# only a comment\n\n"), []);
  });
});

describe("parseDomainList — rejects what it would otherwise have to guess", () => {
  test("a CSV export is an error, with line numbers and a hint", () => {
    const csv = 'domain,domain_rating,dofollow_links\n"seogear.shop",3,12\n';
    assert.throws(
      () => parseDomainList(csv, "refdomains.csv"),
      (e: unknown) =>
        e instanceof DomainListError &&
        /refdomains\.csv: 2 line\(s\)/.test(e.message) &&
        /line 1:/.test(e.message) &&
        /not a CSV\/JSON export/.test(e.message),
    );
  });

  test("a JSON array is an error", () => {
    assert.throws(() => parseDomainList('[{"domain":"a.com"}]'), DomainListError);
  });

  test("a bare word or a spaced header is an error", () => {
    assert.throws(() => parseDomainList("localhost\n"), DomainListError);
    assert.throws(() => parseDomainList("Top linking sites\na.com\n"), DomainListError);
  });

  test("lists at most five bad lines", () => {
    const text = Array.from({ length: 8 }, (_, i) => `bad line ${i}`).join("\n");
    assert.throws(
      () => parseDomainList(text),
      (e: unknown) => e instanceof DomainListError && /… and 3 more/.test(e.message),
    );
  });
});

test("normalizeDomain strips the disavow prefix and URL parts", () => {
  assert.equal(normalizeDomain(" domain:WWW.Foo.com "), "foo.com");
  assert.equal(normalizeDomain("http://bar.io/x?y=1"), "bar.io");
});
