/**
 * Read a referring-domain list for the disavow scripts.
 *
 * The input is a plain list, one domain per line, the format brsg-link-audit
 * writes as `disavow-domains.txt` and the easiest thing to produce from a
 * DataForSEO `backlinks/referring_domains/live` pull (take `items[].domain`).
 *
 * Also accepted, because they are still one domain per line:
 *   - `domain:example.com` lines, so a Google-format disavow file can be fed back in;
 *   - `#` comments (whole-line or trailing) and blank lines, which are skipped;
 *   - `https://`, `www.` and trailing paths, which are stripped.
 *
 * Anything else is rejected with its line number rather than guessed at. In
 * particular, CSV and JSON exports are no longer parsed: the old parsers picked
 * a `domain` column out of a third-party export BRSG does not use. A wrong
 * guess here becomes a wrong disavow, so a loud error is the safer failure.
 */

/** One DNS label: letters, digits, hyphens; no leading/trailing hyphen. */
const LABEL = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
const DOMAIN_RE = new RegExp(`^(?:${LABEL}\\.)+[a-z]{2,63}$`);

export function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^domain:/, "")
    .replace(/^[a-z]+:\/\//, "")
    .replace(/[/?#].*$/, "")
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

export class DomainListError extends Error {}

/**
 * Parse a domain list. Returns domains in first-seen order, normalized and
 * deduplicated. Throws DomainListError listing the first few bad lines.
 */
export function parseDomainList(text: string, source = "input"): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const bad: string[] = [];

  text.split(/\r?\n/).forEach((rawLine, i) => {
    const line = rawLine.replace(/^﻿/, "").split("#")[0].trim();
    if (!line) return;
    const d = normalizeDomain(line);
    if (!DOMAIN_RE.test(d)) {
      bad.push(`  line ${i + 1}: ${JSON.stringify(rawLine.trim().slice(0, 80))}`);
      return;
    }
    if (!seen.has(d)) {
      seen.add(d);
      out.push(d);
    }
  });

  if (bad.length) {
    const looksTabular = bad.some((b) => /[,\t;{["]/.test(b.slice(b.indexOf(":") + 2)));
    throw new DomainListError(
      [
        `${source}: ${bad.length} line(s) are not a domain:`,
        ...bad.slice(0, 5),
        ...(bad.length > 5 ? [`  … and ${bad.length - 5} more`] : []),
        looksTabular
          ? "Expected one domain per line, not a CSV/JSON export. Take just the domain column, e.g. " +
            "brsg-link-audit's disavow-domains.txt or a DataForSEO referring_domains pull (items[].domain)."
          : "Expected one domain per line.",
      ].join("\n"),
    );
  }
  return out;
}
