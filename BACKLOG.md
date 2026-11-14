# AgedLeadSales.com Backlog

> Prioritized backlog of features, enhancements, and fixes. Audited against [lead-gen-patterns.md](../_shared-docs/lead-gen-patterns.md) on 2026-04-04.
>
> **Priority levels:** P0 = critical gap, P1 = high value, P2 = important, P3 = future growth

---

## 2026-11-14 — Close-to-page-one queries: direct answers, titles, internal links
<!-- added 2026-11-14 session — positions from Bill's Search Console read; current 7d page data from data/gsc-trend.json (2026-11-14 snapshot) -->

Queries in positions 8–20: `aged leads` (12.7), `aged insurance leads` (12.8), `iul leads` (14.7). No GSC
query→page access in-session, so the target page for each was picked from content and the 2026-11-14
trend snapshot (`/lead-types/iul-leads` 13.1, `/lead-types/insurance-leads` 46.2 over 7d).

- [x] **`aged leads` → `/`. RESOLVED 2026-11-14.** The homepage H1 is a brand line ("You Bought the
  Leads. Now Work Them.") and nothing above the fold said what an aged lead *is*. Added a short "What are
  aged leads?" answer block directly under the stats strip, linking to `/price-index`, `/lead-types` and
  `/providers` with descriptive anchors. Title left as is — it already carries the term.
- [x] **`aged insurance leads` → `/lead-types/insurance-leads`. RESOLVED 2026-11-14.** metaTitle now opens
  with the exact query ("Aged Insurance Leads for Agents: Multi-Line Pricing"), metaDescription opens
  with a definition, and the hero (Sanity `lt-insurance.shortDescription`) now answers "what are they"
  in its first sentence. Dropped the unsourced "80–90% less" claim from the hero.
- [x] **`iul leads` → `/lead-types/iul-leads`. RESOLVED 2026-11-14.** metaTitle "IUL Leads for Agents:
  Aged Indexed Universal Life Leads"; the old description ("High-value leads at affordable prices")
  replaced with a definition; hero (Sanity `lt-iul.shortDescription`) now opens "IUL leads are…".
  Internal links into the hub: `/blog/iul-leads-financial-advisors-playbook` had **zero** links — added a
  closing paragraph linking the hub and `/blog/how-to-work-iul-leads`; `/blog/iul-leads-cost` and
  `/blog/how-to-work-iul-leads` linked the hub only through `/buying-leads/*` 308s — repointed straight
  at `/lead-types/iul-leads`.
- [x] **Broken link fixed in `/blog/how-to-work-life-insurance-leads`** — "complete guide to working
  insurance leads" pointed at `/blog/how-to-work-aged-insurance-leads`, a **404**. Now "guide to aged
  insurance leads" → `/lead-types/insurance-leads`. Same post: "buy IUL leads" (lowercase sentence
  start, via a 308) → "Add IUL leads" → `/lead-types/iul-leads`; `/tools/aged-lead-roi-calculator` 308s
  repointed to `/calculators/roi-calculator` in all three posts. The post had no `excerpt` (a required
  field), which blocked publishing; wrote one from its intro.
- [x] **P1 life insurance — the backlog's own next step, done. 2026-11-14.** The 2026-08-06 entry said:
  re-measure after GSC warms up, and if the page is still deep *with* head-term targeting and corrected
  pricing, "the answer is links, not content." Re-measured from `data/gsc-trend.json`: rolling 7d to
  2026-11-14, **356 impressions, avg position 47.9** — still page 5. So no content was added. Built the
  on-site half of "links": a curated `RELATED_LEAD_TYPES` map (`data/lead-type-vertical-map.ts`) and a
  "Related lead types" block on every lead-type guide, so the insurance family links to itself in body
  content for the first time. `/lead-types/life-insurance-leads` now gets contextual links from
  insurance, IUL, final expense, annuity and health insurance. Off-page links remain the open part.
- [ ] **Not done, noted:** `/blog/iul-leads-financial-advisors-playbook` still quotes a $22,500 401(k)
  limit in an example script (2023 figure; IRS 2026 limit is $24,500) and commission/income ranges with no
  source. Worth a sourcing pass; out of scope for an internal-linking change.


## 2026-08-18 — The consolidation is not failing. It is waiting on a crawl.

<!-- added 2026-08-18 — every claim probed live: production HTTP, GSC URL Inspection, GSC trend data, ALS GA4, Ahrefs -->

Affiliate sessions into agedleadstore.com are down roughly half and have not recovered 15 days
post-cutover. That decline is real and worth taking seriously. But it is **not** evidence that the
consolidation was wrong, and the redirect layer is not at fault. The transfer is stalled one step
earlier than anyone was looking: **Google has not recrawled the old URLs, so it has never seen the
301s.**

**The mechanics are correct.** All 20 of the highest-traffic old URLs were probed live: every one
returns a single-hop 301/308 to its exact page-level counterpart from `data/migration/url-map.csv`.
Zero homepage dumping, zero chains, zero 404s. `robots.txt` is open, the new sitemap serves 330 URLs,
and the affiliate CTAs on the money pages still deep-link to the correct agedleadstore.com product
pages with `utm_source=workagedleads&utm_medium=affiliate` intact. Nothing in this repo is broken.

**The stall, with proof.** GSC URL Inspection on the three highest-traffic migrated pages:

| old URL | last crawled | Google-selected canonical |
|---|---|---|
| `/buying-leads/buy-iul-leads` | 2026-07-31 | still itself |
| `/buying-leads/buy-life-insurance-leads` | 2026-07-06 | still itself |
| `/blog/aged-lead-pricing-guide` | 2026-07-02 | still itself |

Every one was last crawled **before** the 2026-08-03 cutover. Google is still serving stale index
entries for the old domains and still treating each old URL as its own canonical. That single fact
explains the whole picture: the old properties keep the impressions, the new domain gets almost none,
and users who do click an old SERP entry are redirected correctly but contribute nothing to the new
domain's authority.

**The transfer has begun.** `sc-domain:workagedleads.com` went from `no-data` to reporting on
2026-08-14, and rolling-7d impressions are compounding: **1 → 2 → 3 → 8 → 45** (Aug 14→18). Position
is deep (63.8) exactly as expected for URLs Google is seeing for the first time. Meanwhile
`agedleadsales.com` still holds ~5,800 impressions/7d and its **position has improved** through the
migration (22.95 on 08-02 → 20.06 on 08-18). The equity is intact and sitting in the old property,
not lost. Ahrefs still shows 0 organic keywords for the new domain vs 18 for the old — the expected
lag for a 15-day-old domain, and the lagging indicator agreeing with the leading one.

**Measured decline (ALS GA4 property 357329146, the commission scoreboard):** combined
`agedleadsales` + `howtoworkleads` + `workagedleads` sessions ran ~14–16.5/day over 07-04→08-02 and
**5.4/day** over 08-04→08-17. That independently reproduces the 5.6/day figure in the email plan.

### P1 — accelerate the crawl (Search Console operations, Bill only)

These are the levers that actually move the stalled step. None of them are code.

- [x] **DONE 2026-09-01 — Change of Address filed and accepted for BOTH old domains**
      (`agedleadsales.com` → `workagedleads.com`, `howtoworkleads.com` → `workagedleads.com`).
      Bill filed them after earlier attempts had failed; this time validation passed.

      History, because it explains why this entry was a mess. It failed repeatedly in August;
      `CLICK-LOOP.md` wrote it off on 2026-08-18 ("Confirmed dead. Redirects stay; we stop
      pushing."), while this file kept it open as "the single highest-leverage action available"
      — a claim inferred from the trend cron reading both properties, not from the tool ever
      succeeding. The two files disagreed and the optimistic one drove the plan.

      **Why the retry worked is not established.** The most likely reason is simply that the
      site side finally satisfied the validator and a retry landed: as of today every redirect a
      validator would follow is a literal cross-domain 301, which was not true in early August
      (`howtoworkleads.com` emitted a 308 via `permanent: true` until the homepage rule was
      switched to `statusCode: 301` — see memory
      `tools/feedback_gsc_change_of_address_needs_literal_301.md`). Google's own community
      guidance on this error is also "wait 24–48 hours and try again," so elapsed time may be
      doing the work. Do not record a cause we did not test.

      Measured 2026-09-01, every redirect is objectively correct:

      | fetched | result |
      |---|---|
      | `https://agedleadsales.com/` | **301** → `https://workagedleads.com/` |
      | `https://www.agedleadsales.com/` | **301** → `https://workagedleads.com/` |
      | `https://howtoworkleads.com/` | **301** → `https://workagedleads.com/` |
      | `https://www.howtoworkleads.com/` | **301** → `https://workagedleads.com/` |
      | `http://agedleadsales.com/` | **308** → `https://agedleadsales.com/` (same domain) |
      | `http://howtoworkleads.com/` | **308** → `https://howtoworkleads.com/` (same domain) |

      Page-level 301s preserve the path, canonicals point at the new domain, the sitemap serves
      330 `workagedleads.com` URLs, robots allows. Nothing on the site side is broken.

      The `http://` rows stay recorded because they are the standing hazard: Google documents
      `http://example.com` as a **domain-level property in its own right**, and Vercel 308s that
      form to *itself* at the edge before any application code runs. A validator landing there
      never observes "old homepage 301s to new homepage" and returns `Validation failed. Couldn't
      fetch the page.` — an error that reads like an outage and is not one. The edge 308 cannot be
      changed from this repo. If a future domain move stalls on that error, this is the first
      thing to check, and the `https://` URL-prefix properties (domain-level, therefore eligible)
      are the fallback to file from.

- [x] **Measure the Change of Address at +2 weeks — 2026-09-15.** This is the whole point of
      having filed it, and nothing else on this list tells us whether it took. Baseline captured
      2026-09-01, the day of filing (7-day rolling, from `data/gsc-trend.json` plus the GSC
      property for howtoworkleads):

      | property | clicks | impressions | avg position |
      |---|---:|---:|---:|
      | `agedleadsales.com` (retiring) | 37 | 4,217 | 20.1 |
      | `howtoworkleads.com` (retiring) | ~4/day | ~600/day | ~22 |
      | **`workagedleads.com`** (live) | **1** | **338** | **65.0** |

      Success looks like the two retiring rows draining into the third — old-domain impressions
      falling while `workagedleads.com` impressions rise and its average position moves from 65
      toward the ~20 the old domains hold. Watch position, not just clicks: position is the
      earliest signal that Google has begun crediting the new host.

      Do **not** read a flat two weeks as failure. Change of Address prioritizes recrawl; it does
      not move rankings on a schedule we control, and Google honors the signal for roughly 180
      days. The redirects were always doing the consolidation on their own — this is an
      accelerator, and it was never a requirement.

      **MEASURED 2026-09-15 (+2 weeks).** 7-day rolling; `workagedleads` and `agedleadsales` from
      `data/gsc-trend.json` on main, `howtoworkleads` from the URL-prefix GSC property (the
      `sc-domain:` form returns 403 to the MCP identity; the URL-prefix one is owner-verified).

      | property | clicks | impressions | avg position |
      |---|---:|---:|---:|
      | `agedleadsales.com` (retiring) | 15 (was 37) | 2,529 (was 4,217) | 12.1 (was 20.1) |
      | `howtoworkleads.com` (retiring) | 6 (was ~28) | ~2,030 (was ~4,200) | 17.6 (was ~22) |
      | **`workagedleads.com`** (live) | **8** (was 1) | **3,454** (was 338) | **41.7** (was 65.0) |
      | combined | ~29 (was ~66) | ~8,000 (was ~8,750) | — |

      Read: **the visibility transferred, the clicks did not.** New-domain impressions rose tenfold
      while the two old domains drained, and combined impressions held within ~8%. But the new host
      is ranking those impressions around position 42 against the ~20 the old domains held, so
      combined clicks are down by roughly half. The old domains' average position *improving* to
      12–18 is survivorship — their weak pages redirected away first and the strong ones remain.

      Caveats: two weeks, GSC's 2–3 day reporting lag, mixed page sets, tiny click counts. Per the
      standing rule, do not act on page-aggregate position — the real test is query-level position
      on the money terms.

      Not failure yet, and not success. **Next checkpoint +6 weeks, 2026-10-13**, after Bill is back:
      pull query-level position for the top 15 old-domain money queries. If the new host still sits
      near 40 on those, the problem is on-page or authority, not crawl, and the Request Indexing item
      below will not fix it.

- [ ] **Add `howtoworkleads.com` to `GSC_PROPERTIES` in `lib/cron/gsc-properties.ts`.** It is a
      third pool of live search equity (~600 impressions/day) now under an active Change of
      Address, and the trend cron does not watch it — so the drain will only be half visible in
      `data/gsc-trend.json`. It can be read manually from the GSC property in the meantime, which
      is why this is not a blocker for the 09-15 measurement.
      NEEDS BILL 2026-11-14: the code half is done — the entry (`key: "howtoworkleads"`,
      `https://howtoworkleads.com/`) has been in `GSC_PROPERTIES` since 2026-10-07 — but **every
      run since returns 403** ("User does not have sufficient permission for site
      'https://howtoworkleads.com/'", in each `chore(gsc)` commit message, e.g. `3bd907a`), so
      `data/gsc-trend.json` holds zero `howtoworkleads` rows. Step: Search Console → property
      `https://howtoworkleads.com/` → Settings → Users and permissions → Add user
      `brsg-analytics-reader@brsg-mcp.iam.gserviceaccount.com` (the identity the cron impersonates
      via WIF), permission Restricted. The next 12:00 UTC run then writes rows with no code change.
- [x] **SKIPPED 2026-09-15 (Bill).** The +2 week reading above shows new-domain impressions up tenfold, which
      means Google has already crawled and indexed these pages. The gap is ranking (position ~42 vs ~20),
      and requesting indexing does not move ranking. Revisit only if the 2026-10-13 query-level check shows
      money pages missing from the index rather than ranking low.
- ~~**Request Indexing on the top ~15 new-domain money pages**~~ via URL Inspection. Manual and
      tedious, but it forces a crawl instead of waiting for one. Start with the pages carrying the
      most old-domain clicks: `/lead-types/iul-leads`, `/lead-types/life-insurance-leads`,
      `/lead-types/mortgage-leads`, `/lead-types/insurance-leads`, `/lead-types/final-expense-leads`,
      `/providers/aged-lead-store`, `/blog/aged-lead-pricing-guide`.
- [ ] **Confirm the new sitemap is submitted** in the workagedleads GSC property
      (`https://workagedleads.com/sitemap.xml`, 330 URLs, serving fresh `lastmod`).
      NEEDS BILL 2026-11-14: Search Console → `sc-domain:workagedleads.com` → Indexing → Sitemaps
      → confirm `https://workagedleads.com/sitemap.xml` is listed with Status "Success"; if not,
      enter `sitemap.xml` and Submit. The cron identity cannot read Sitemaps status, so this
      cannot be checked from the repo.

### P2 — the old sitemaps cannot help Google find the redirects

`https://agedleadsales.com/sitemap.xml` and `https://howtoworkleads.com/sitemap.xml` both redirect to
the *new* sitemap. Google's site-move guidance is to keep the **old** sitemap serving the **old**
URLs, so the crawler has a fresh list of exactly the URLs whose 301s it needs to discover. Right now
it has none, which is part of why the recrawl is so slow.

The redirect is a Vercel domain-level rule, not `vercel.json` or `middleware.ts`, so a path exception
cannot be made from this repo. `data/migration/alsales-sitemap.txt` (246 URLs) and
`htwl-sitemap.txt` (175 URLs) already hold the exact lists if this is worth doing. Judgment call:
Change of Address probably makes it unnecessary — do that first and re-measure before adding
redirect complexity.

### P2 — no instrument on the new domain outside the cron

`sc-domain:workagedleads.com` returns 403 to the GSC MCP identity and GA4 `528489903` returns 403 to
the GA4 service account, so the only visibility into the new domain is `data/gsc-trend.json`. That is
why the consolidation looked invisible. The trend cron is the one honest instrument — it is working,
and it is what caught the 08-14 turn-on. Same root cause as the long-standing "GA4 service-account
access to the six BRSG properties" loop.

`howtoworkleads.com` is not in `GSC_PROPERTIES` at all, so the third domain's drain is untracked.
Worth adding once it is known which account can read it — do not add it blind, an unreadable property
would make the cron report a per-property failure daily.

---

## 2026-08-13 — Two monitors were lying, and the backlog believed them
<!-- added 2026-08-13 /session — every claim below probed live: production HTTP, production Sanity, Vercel, Resend -->

Nothing on this site is broken. Three of the open P1s were already resolved, and the one "failing
cron" never failed. The through-line is that **every stale item here came from trusting a signal
instead of measuring the thing** — a GSC row that described a state that no longer existed, and a
health check asserting a cadence the code had deliberately stopped honouring.

**`marketwatch` is not failing, and never was.** It ran 2026-08-01 and recorded
`ok: scanned=15 changed=13 pricingSignals=7`. What alerts daily is `checkMarketwatch` in
`app/api/cron/health-check`, which asserted that `priceBenchmark` docs stay under 35 days old and
named the cron when they didn't. That coupling was severed *on purpose* — see the 2026-06 entry below,
already marked done: marketwatch stopped synthesizing benchmarks because single-provider LLM guesses
were polluting the public index, and `upsertPriceBenchmarks` has had **no callers** since. Nothing
writes `priceBenchmark` on a schedule any more; the Lead Price Index is a quarterly hand-published
study, last landed 2026-06-01. The monitor was measuring a human process on a cron's clock and blaming
the cron. Fixed in *"fix(health-check): stop blaming the marketwatch cron"*: rethresholded to 100 days,
renamed to "Lead Price Index study", and the message now says plainly that a stale index is a
publishing task. Verified against production Sanity — **all four checks pass, where one failed daily.**

- [ ] **P2 [reliability] — `upsertPriceBenchmarks` and `getExistingBenchmarks` are unreachable.** Left
  in place rather than deleted, because removing the only benchmark-writing path is Bill's call. They
  are a footgun: wiring either back up republishes the LLM estimates that were removed on purpose.
  Either delete them or leave a refusal-guard at the top. Effort: S.
- [ ] **P2 [content] — the Lead Price Index is due.** Last study 2026-06-01, covering 2026-03 → 2026-06
  (106 docs). Q3 has not been published. The new check goes red ~2026-09-09 if it still hasn't. This is
  the *real* version of the alert that has been firing all along, and it is a writing task, not a code
  one. Note `components/price-trend-chart` needs 3+ real months per vertical, so the longer this slips
  the more verticals silently drop their trend chart. Effort: M (human research).

**What was already fixed, and got closed today rather than re-worked:** the truncated-metadata sweep
(re-counted: **0** of 154 published posts carry an ellipsis — closed by `a2b0b1c`, the backlog just
never recorded it), the apex/www host split (all four hosts converge on the apex with a correct
self-referential canonical), and the legal-leads gap (shipped `e375a43`). Each is marked in place below.

**Measured state, for the next session.** Affiliate sessions into agedleadstore.com are **4.3/day**
(30 over Aug 6–12, GA4 property 357329146) against an 11.4/day pre-consolidation baseline, and the
`howtoworkleads/website` source has now dropped out entirely — consolidation is completing, volume has
not recovered. GSC on the retired property: 5,098 impressions/wk, 32 clicks, **CTR 0.63% at average
position 20.9**. That is a *position* constraint, not a CTR one, and no title work touches it.
`sc-domain:workagedleads.com` still returns `no-data` — the 21-day aggregation warmup ends ~2026-08-24,
and until then this site is being measured through a property it no longer publishes to.

---

## 2026-08-06 — 97 pages shipped metadata Google truncates — ALL CLEARED
<!-- closed 2026-08-06 /session — verified live: 0 of 329 pages out of spec -->

**Final state, measured live across all 329 sitemap URLs: titles over 60 chars 45 → 0, descriptions
over 160 → 0, pages missing a description 0.** Cleared in four passes:

| pass | what | commit |
|---|---|---|
| 12 lead-type hubs (code) | `data/lead-types.ts` | `b5a6e24` |
| 62 Sanity documents | 44 titles + 36 descriptions | `41ff552` |
| generated descriptions (code) | glossary fallback cap + blog guard | `d20cc87` |
| last 7 hardcoded | compare/price-index/lead-types/resources/provider | `2bdedc9` |

**Two of the four passes were code, not content, and neither was visible from the content side.** The
~29 glossary pages were never authored long — the template falls back to the full term definition with
no cap. The provider profile interpolates the provider name *twice*, so its length depends on the
name. A content-only sweep would have "fixed" both by editing text that was never the problem, and
they would have come straight back.

`lib/meta-description.ts` now caps the glossary and blog surfaces, so this cannot silently recur from
either. It cuts on a sentence boundary before falling back to a word boundary — the thing being
avoided is a description that stops mid-word, which is the defect fixed in 12 posts earlier the same
day. 9 tests.
<!-- added 2026-08-06 /session — measured from live HTML on all 329 sitemap URLs -->

**Audited every page for metadata longer than Google displays: 45 titles over 60 characters and 71
descriptions over 160 — 97 pages, carrying 22,539 impressions.** Each loses the end of its message in
the SERP.

This is the same class as the ellipsis truncation fixed earlier today, and **the earlier sweep missed
it by construction**: that scan looked for a literal trailing `…`, which only finds metadata something
else already cut. Over-length copy looks perfectly fine in source and gets cut by Google instead. Any
future metadata audit needs both checks.

**Fixed in `b5a6e24`: all 12 lead-type hubs**, the commercial pages and the highest-impression subset,
all in one file. Worst were health-insurance (74-char title / 213-char description), home-improvement
(208) and auto-insurance (204). Every hub is now inside 60/160, verified live.

- [x] **~~P2 — ~88 Sanity-authored pages still over the limit~~ — DONE in `41ff552`.** Queried Sanity
  directly rather than re-crawling, which found the true set: **62 documents, 44 titles over 60 chars
  and 36 descriptions over 160.** All rewritten to fit, published, and rebuilt. Worst titles were
  window-replacement (87), bank-statement-loan (86), plumbing (83); worst descriptions lead-data
  hygiene (192), remove-landlines (186), is-it-legal (185).
  Two unsourced claims were dropped rather than shortened, since the sentence was being rewritten
  anyway: the Q2 post asserted *"60% of spring home closings start as dead fall leads"* and a
  *"$300 fresh vs $25 aged at 4% conversion"* comparison. The argument stays, the invented precision
  does not ([[shared/feedback_no_fabricated_data]]).

**Ruled out this pass: retargeting the hubs' keyword fields.** Ahrefs (US, 2026-08-06) shows every hub
except life insurance aimed at an `aged X leads` modifier at 40–150/mo while the head terms run
500–1,400/mo at KD 0–6:

| hub targets | vol | KD | head term | vol | KD |
|---|---|---|---|---|---|
| aged mortgage leads | 70 | 0 | mortgage leads | 1,300 | 6 |
| aged insurance leads | 150 | **22** | insurance leads | 1,400 | **4** |
| aged solar leads | 150 | 0 | solar leads | 1,200 | 6 |
| aged health insurance leads | 100 | 7 | health insurance leads | 800 | 2 |
| aged auto insurance leads | 60 | 3 | auto insurance leads | 700 | 1 |
| aged medicare leads | 90 | 0 | medicare leads | 600 | 3 |
| aged final expense leads | 100 | 1 | final expense leads | 500 | 3 |

`insurance-leads` is the standout — it targeted a term **9× smaller and 5× harder** than the head term.
**But `primaryKeyword` and `secondaryKeywords` in `data/lead-types.ts` are inert.** Nothing reads them;
the only matches elsewhere belong to the content cron's unrelated `ArticleBrief` type. The template
renders `metaTitle`/`metaDescription` only, and every one of those already contains its head term.
Rewriting the fields would have looked like progress and changed nothing, so it was not shipped.

- [ ] **P3 [seo] — decide whether the hubs should lead with the head term rather than the modifier.**
  Every title currently opens with "Aged …". That is on-brand and not disqualifying — agedleadstore.com
  ranks #4 for "life insurance leads" with a title opening "Buy Aged …" — so this is a judgement call
  about positioning, not a defect. Test on one hub before changing twelve. Effort: S.

---

## 2026-08-06 — Internal link equity was pointed away from the demand (fixed), and what's left on life insurance
<!-- added 2026-08-06 /session — internal links counted by crawling all 329 live pages; impressions from data/migration/url-map.csv -->

**Fixed in `dd29568`.** The footer renders on all 329 pages, so its "Lead Types" list *is* the site's
internal link budget. It was allocated backwards:

| hub | internal links | impressions |
|---|---|---|
| mortgage | 329 | 1,966 |
| iul | 329 | 3,935 |
| insurance | 329 | 2,526 |
| final-expense | 329 | 1,582 |
| **life-insurance** | **31** | **21,132** |

Life insurance carries more demand than all four listed hubs **combined** (21,132 vs 10,009), had a
tenth of their internal links, and sits at average position 33.6. Footer reordered by measured demand;
life insurance and home improvement added, nothing dropped. Ranking lever, not a CTR one — expect
movement in average position over weeks, if at all.

**Correcting the 2026-08-05 entry below.** It described `/lead-types/life-insurance-leads` as *"a
14,467-word page that already has the depth"* and concluded the only problem was rank. Measured live,
that page renders **3,742 words including nav and footer** — and it is *shorter than the blog post in
its own cluster*, `/blog/how-to-work-life-insurance-leads` at 5,510 (same measurement method, same
day). The 14,467 figure belongs to a different URL and a different measurement. The page does not
already have the depth, so "ranking problem only" was the wrong conclusion.

**~~P1 deepen the life-insurance hub~~ — researched and REJECTED; done differently in `8299036`.**
The SERP argued against the plan. Measured 2026-08-06:

| | position | words | DR |
|---|---|---|---|
| QuoteWizard | **1** | **830** | 68 |
| agedleadstore.com | 4 | 2,229 | 32 |
| gainaltitude.ai | 5 | — | **24, one backlink** |
| ours | 33.6 | **3,742** | — |

**The page that wins has 830 words. Ours is already 4.5× longer than the winner**, so adding 5,000
more would have been padding. A DR-24 page with a single backlink at #5 is what a winnable-on-page
SERP looks like — this was never an authority or a depth problem.

The actual gap was **keyword targeting**. Ahrefs, US: *life insurance leads* **1,900/mo KD 2** (parent
topic) vs *aged life insurance leads* **150/mo KD 4** — which is what the page led with, leaving 12.6×
the volume on the table. That an aged-leads page can win the head term is settled by
agedleadstore.com ranking #4 with exactly that kind of page. Retargeted primary/secondary keywords,
metaTitle and metaDescription at the parent topic; also picked up *life insurance leads for agents*
(300/mo, **KD 1**).

**Pricing was wrong in the direction that costs money.** The page stated `$0.50–$2.00` aged against
`$12–$40` real-time. The marketplace publishes **$0.40** at 86–365 days and **$0.25** beyond, and our
own `data/price-benchmarks.ts` sampling puts shared real-time at a **$22 median ($15–$30, n=5)**,
exclusive at **$50 ($30–$75, n=4)**, and aged 31–85 days at **$1.25 ($0.62–$1.88, n=4)**. So the page
advertised a worse floor than the vendor it links to and understated the saving at the top. `whyUse`
now runs on our own multi-provider sampling rather than a vendor rate card — **that independence is
the one asset this page has that the pages outranking it do not** — with per-bracket figures left to
the price index per the convention already stated in `data/lead-types.ts`.

**Cannibalisation resolved (was P2).** `/lead-types/insurance-leads` carried `"life insurance leads"`
in its secondaries, so two of our own pages chased one head term. The generic hub keeps the
multi-line and cross-sell angle; the head term belongs to the vertical hub.

> **Caveat on the 33.6.** That is pre-cutover data for the old `howtoworkleads.com` URL that folded
> into this page. The new page's true position is unmeasured until GSC finishes aggregating
> (~2026-08-24). Re-measure before drawing conclusions from any of this.

- [ ] **P2 [seo] — re-measure life insurance after GSC warms up (~2026-08-24)** and confirm the
  retarget moved it. If it is still deep on page 3+ *with* head-term targeting and correct pricing,
  then the remaining gap is genuinely off-page and the answer is links, not content. Effort: S.
- [ ] **P3 [seo] — the same keyword audit has not been run on the other 11 hubs.** Life insurance was
  targeting a 150/mo modifier over a 1,900/mo parent topic; nothing suggests it is the only one. Pull
  parent topic vs current `primaryKeyword` for each. Effort: M.
- [x] **P3 [content] — no `leadType` covers general legal work. DONE 2026-08-13 (`e375a43`).** Built
  `/lead-types/legal-leads` as a real umbrella guide, not a stub: 6 deep-dive sections, 7 FAQs, FAQPage
  + BreadcrumbList JSON-LD, 136,927 bytes live. Deliberately a hub rather than a ninth sibling — MVA
  and SSDI keep their own guides and their own head terms, so duplicating that depth here would just
  split their rankings. `legal` now maps to the umbrella instead of `mva-leads`, and
  `lib/lead-type-cluster.test.ts` pins the round-trip so the cluster link cannot silently vanish the
  way `home-services-leads` did.
  **Tagged 3 of the 5 posts, not 5.** Bankruptcy, family law and workers' comp are attorney intake and
  now deep-link to `/legal-leads/`. The two debt posts target debt-relief and credit-counselling firms,
  not attorneys, and the partner has no debt buy page anywhere in their catalogue — tagging them would
  point a debt buyer at an attorney-intake page, which is the silent conversion leak `lib/affiliate.ts`
  warns about. Left untagged they fall back to `/all-lead-types/`, where the buyer can filter. Verified
  live: `how-to-work-debt-leads` serves 4× `/all-lead-types/` as intended.

---

## 2026-08-06 — Affiliate CTAs deep-link for the first time (fixed)
<!-- added 2026-08-06 /session — measured from live HTML on all 329 sitemap URLs + partner URL verification -->

**Fixed in `356a68f`.** `InlineTextCta` resolved its destination from a lowercase-slug map, but every
caller passes a Sanity `leadType.title` ("Mortgage Leads", not "mortgage"), so the lookup could never
match. Two consequences, both verified live first:

- **Every component-generated affiliate link resolved to `/all-lead-types/`** — the generic catalogue —
  on a site whose entire IA is organised by lead type. Sampled before the fix on blog posts *and* on
  `/lead-types/mortgage-leads`, where buyer intent is unambiguous.
- The unmatched title also flowed into the label, appending "leads" to a string already ending in
  "Leads". **102 of 154 posts set `leadTypes`**, so ~102 published pages read *"Looking for aged
  Mortgage Leads leads?"*

**The naive fix would have been worse than the bug.** Checking the paths against the partner before
wiring the lookup up: `/medicare-leads/` **404**, `/home-services-leads/` **404**, `/solar-leads/`
redirects to a **blog post**, `/final-expense-leads/` redirects. The broken lookup had been masking
three dead destinations; repairing it naively would have routed paying traffic into 404s.

**Corrected same day in `14bfb5e` — the first fix pointed at the wrong pages.** `356a68f` verified every
destination returned 200 and treated that as proof. It isn't. Aged Lead Store publishes an article and
a buy page under confusingly parallel slugs, so five paths resolved fine while being editorial content:
`/insurance-leads/` is "Insurance Leads Generation Tips…", `/mortgage-leads/` is a **tag archive**, and
`/home-improvement-leads/`, `/online-final-expense-leads/` and `/solar-installation-leads/` are
articles. **77 of the 122 deep links were landing purchase intent on blog posts** — a quieter failure
than the 404s the check was written to avoid, because nothing looks broken.

**The authority is the partner's "Buy Aged Leads" nav dropdown**, on any page of agedleadstore.com —
the pages they have chosen to sell from. Never infer these from URL patterns, and never accept a 200 as
verification; check the nav and the page title. Map re-derived from that menu and re-verified.

Result across all 329 pages: **0 broken destinations**, and deep links now land on buy pages. Lead-type
pages also gained their first in-body affiliate CTA; their mid-page banner passes `buttonHref`, which
sets `useAffiliate` false, so the only affiliate link had been the sitewide footer one.

- [ ] **P2 [affiliate] — 47 of 154 posts have no `leadTypes` set** and therefore cannot deep-link;
  they fall back to the catalogue. Tagging them is pure upside: no new writing, and it converts a
  generic landing into a buy page for the matching vertical. Effort: S.
  <!-- was 52; re-counted in Sanity 2026-08-13: 154 published posts, 107 tagged, 47 untagged. The 5
  closed by the legal-leads cluster above account for 3 of the difference (the 2 debt posts stay
  untagged by decision). Note the remaining 47 are not all tag-able — a large share are
  vertical-agnostic (scripts, compliance, CRM, deliverability) with no correct buy page to point at.
  Count the genuinely-mappable subset before sizing this. -->

**Destination set reviewed and confirmed correct by Bill, 2026-08-06.** Medicare and solar route to
`/all-lead-types/` **by decision, not by gap** — Troy is not selling either vertical at the moment.
Do not "fix" this by inventing a path; revisit only if it appears in the partner's buy menu.

- [ ] **P3 [content] — Medicare + solar traffic is currently unmonetisable.** 23 URLs carrying **2,181
  impressions / 12 clicks (2.5% of the corpus)** point at verticals Troy does not sell. Small enough
  not to act on, and the pages still earn topical authority — but do not commission *new* Medicare or
  solar content while that holds, and re-check before any content investment there. Effort: n/a
  (a hold, not a task).
- [ ] **P3 [content] — three verticals the partner SELLS that this site has no page for:** **ACA**,
  **Obamacare**, **Homeowners Insurance**. All three are mapped in `lib/affiliate.ts` and start
  working the moment a `leadType` exists. Ranked P3 rather than P2 because it is net-new, not a
  harvest: existing coverage is 1 URL at 0 impressions for ACA/Obamacare and 2 URLs at 263
  impressions for homeowners. Real demand on the partner's side, but no traffic here to convert yet.
  Effort: M each.

---

## 2026-08-06 — Truncated SEO metadata on 12 posts (fixed), and why publishing didn't ship it
<!-- added 2026-08-06 /session — measured from live HTML across all 329 sitemap URLs + Sanity p7rbtajg/production -->

**Fixed.** 12 blog posts shipped `seo.metaTitle` hard-cut at exactly 58 characters and
`seo.metaDescription` at 158, both mid-word with an ellipsis appended, written by the retired content
generator and stored in Sanity. `app/(site)/blog/[slug]/page.tsx` reads those fields verbatim, so the
truncation went straight to the SERP.

Worst case was `/blog/aged-lead-store-review-2026` — the Aged Lead Store review, the highest
commercial-intent page in the affiliate relationship — rendering as *"Aged Lead Store Review (2026):
Honest Assessment of the L…"* at **position 6.1, 253 impressions, 0.76% CTR**. Same site, same intent,
**worse** position: `/providers/the-leads-warehouse` sits at 7.9 and earns **3.42% CTR**. A competitor's
review out-earned our own affiliate partner's review by 4.3× at a lower rank.

All 12 rewritten (titles ≤60 chars, descriptions ≤155, complete sentences), published, and verified
live — 0 of 329 pages now ship truncated metadata.

- [x] **RESOLVED (verified 2026-09-15) — `sanity/lib/fetch.ts` on main now sets `SANITY_REVALIDATE_SECONDS = 300` with a
  `SANITY_CACHE_TAG`, and `app/api/revalidate/route.ts` exists for the Studio webhook. A publish reaches the site within five
  minutes; the first request after an edit can still serve the old copy while it revalidates, so check twice.**
- ~~**P1 [content-ops] — a Sanity publish does not reach the live site.**~~ This is the finding that
  outlasts the batch above. `sanity/lib/fetch.ts` calls `client.fetch` with no cache options, the blog
  route exports no `revalidate`, and there is no webhook or on-demand revalidation route anywhere in
  `app/api`. Pages are baked at build, so publishing changes nothing until someone happens to deploy.
  Proof: after publishing all 12, **7 updated and 5 kept serving build-time HTML** — it took an empty
  commit (`9cbebaf`) to finish the job. The failure mode is silent and looks like the edit didn't save.
  Every editorial change is exposed to this, including anything Bill publishes by hand. Fix: add an
  on-demand revalidation route plus a Sanity webhook, or set an explicit `revalidate` on the content
  routes. Effort: S–M.
  **FIXED 2026-08-13 (`8075ec7`, *"fix(sanity): make a Studio publish actually reach the live
  site"*).** Both halves, at the one chokepoint:
  `sanityFetch` now tags every query and bounds staleness at 5 minutes, and `POST /api/revalidate`
  collapses that to zero when the Studio fires a webhook. The build proves it — `/blog`, `/lead-types`,
  `/glossary`, `/guides`, `/playbook`, `/price-index`, `/providers`, `/authors` and `/sitemap.xml` now
  report a revalidate window across **31 routes**; every one was static-forever before.
  Two details worth keeping: the route uses `revalidateTag(tag, { expire: 0 })`, not the usual `"max"`
  profile — `max` only marks the tag stale and serves stale-while-revalidate, so the first visitor
  after a publish would still get the old page. And `lib/sanity-cache.test.ts` asserts no route under
  `app/` reads Sanity outside `sanityFetch`, because a page that bypasses it renders perfectly and
  simply freezes at build-time content — the same silent failure, reintroduced.
  **Still to do (Bill, one-time):** add the Sanity webhook — Manage → API → Webhooks → URL
  `https://workagedleads.com/api/revalidate`, triggers create/update/delete on dataset `production`,
  header `Authorization: Bearer <CRON_SECRET>`. Without it the 5-minute window still holds, so this is
  the fast path, not the fix.

- [x] **P1 [seo] — apex/www host split. VERIFIED RESOLVED 2026-08-13**, no code change needed. Probed
  live: `www.workagedleads.com` → 308 → apex on both `/` and the IUL blog route, and both retired
  domains still 301 to the apex. The GSC rows showing two hosts were the old property's recrawl lag,
  not a live split. See the duplicate entry under 2026-07-31 below.
- [ ] **P2 [seo] — audit the rest of the generator's output.** The truncation was a systematic defect
  in generated posts, not a one-off. Titles were cut at 58 and descriptions at 158 — suspiciously close
  to display limits, so whatever wrote them was "optimizing" length and cutting mid-word instead of
  writing to fit. Worth checking what else that generator emitted (H1s, excerpts, OG tags, schema
  fields) for the same pattern before trusting any of it. Effort: S.

---

## 2026-08-05 — Where the merged domain's traffic is actually stuck
<!-- added 2026-08-05 /brsg-session — measured from data/migration/url-map.csv (pre-cutover GSC clicks/impr/pos per source URL) + live HTML -->

**Retracting the cannibalization finding filed earlier today.** It claimed the merge created 25
topical collisions worth 4,833 impressions and recommended picking one canonical target per vertical.
Checked properly, it does not hold:

- The 25 "collisions" are destinations fed by **both** source domains — pages the merge *resolved*
  onto one URL, not competition it created. Combined 16,907 impressions, now consolidated. That is
  the design working.
- Internal anchors already point from each `/blog/how-to-work-{x}-leads` to its matching
  `/lead-types/{x}-leads` hub. Verified live on the MVA and SSDI pairs.
- Titles are already split by intent — `Aged MVA Leads – …for Attorneys` vs `How to Work MVA Leads:
  The Intake Specialist's Playbook`. Commercial hub vs informational how-to, which is correct.

Slug-token overlap finds candidates, not competition. It should not have been reported as a finding
before checking the anchors and titles it was proposing to change.

**What the same data does show, which matters more.** Of the 353 live destinations, 88 carry position
data covering 58,412 impressions:

| position | pages | impressions | clicks | CTR | share of impr |
|---|---|---|---|---|---|
| 1–3 | 0 | — | — | — | — |
| 4–10 | 27 | 8,465 | 52 | 0.61% | 14.5% |
| 11–20 | 45 | 22,155 | 188 | 0.85% | 37.9% |
| **21–40** | **13** | **25,957** | **87** | **0.34%** | **44.4%** |
| 41+ | 3 | 1,835 | 4 | 0.22% | 3.1% |

- [ ] **P1 [seo] — 44% of measurable impressions sit on page 3–4, and 81% of that is one page.**
  `/lead-types/life-insurance-leads` carries **21,132 impressions at average position 33.6** for 52
  clicks — 36% of every measured impression on the merged site, stranded past page 3. Why: 0.25% CTR
  at position 33.6 is *normal for that position*, so this is not a title or snippet problem and no
  amount of CTR work touches it. It is a ranking problem on a 14,467-word page that already has the
  depth. Moving it from p33 to p15 is worth roughly 3–5× its clicks, and it is the largest single
  lever on the site by an order of magnitude. Effort: M.
  NEEDS BILL 2026-11-14: the on-site half is done (PR #78: curated "Related lead types" links from
  five sibling guides). Rolling 7d to 2026-11-14 the page is at **position 47.9** (356 impr) —
  still deeper than the 33.6 baseline — so the remaining lever is off-page: earn links to
  `/lead-types/life-insurance-leads` specifically (digital PR / partner placements, tracked as
  offline work per the 2026-06-09 note). Its series is now recorded daily (`watchedPages`, below).
- [ ] **P2 [seo] — nothing ranks 1–3.** Zero pages in the top three across 88 measured. The site's
  entire click base comes from positions 4–20. Worth knowing before any content investment: the
  ceiling here is a ranking ceiling. Effort: S (diagnosis).

**Do not act on either yet, and that is the finding.** Consolidation of two domains' authority is
precisely the intervention that moves a page-4 page, and it went live 4 days ago. Search Console has
no data for the new property until ~2026-08-24 (21-day aggregation warmup). Stacking speculative
on-page work now would contaminate the only clean read we will get of whether the merge worked.

- [ ] **P1 [seo] — instrument the one page that answers the question.** Track weighted position for
  `/lead-types/life-insurance-leads` weekly from the day `sc-domain:workagedleads.com` starts
  reporting. Why: it is 36% of the impression base and it is the page whose movement distinguishes
  "the merge consolidated authority" from "the merge did nothing". Re-run this whole table once GSC
  aggregates and compare against the pre-cutover baseline above. Effort: S.
  RESOLVED 2026-11-14 (this PR): the page was only visible when it made the top-10-by-clicks
  `topPages` — missing on 25 of 45 days between 10-01 and 11-14. `GscPropertyConfig.watchPages`
  now names it on `workagedleads`, the cron reads it by exact URL every day, and each snapshot
  carries `watchedPages: [{page, row}]` (`row: null` = no impressions that week, recorded as such).
  Series so far from `topPages`: 26.0 (10-01) → 39.7 (10-08) → 38.8 (10-24) → 46.3 (11-08) →
  47.9 (11-14). Verify live after merge: the first snapshot after deploy has a `watchedPages` key.

## 2026-08-05 — /blog page weight (deferred, deliberately)

`/blog` serves **568 KB of HTML** against 94 KB for the homepage and 66 KB for
`/playbook`. `postsQuery` selects every post with full `mainImage` objects and
all three relation sets, and the index renders the lot, so the RSC payload
carries the entire archive on every visit. Server time is fine (TTFB 0.16 s) —
this is payload and mobile parse cost, not a server problem.

**Not fixed during the 2026-08-05 cutover repair, on purpose.** The obvious fix
is pagination, and pagination changes URLs and internal crawl paths on a site
that is three days into a domain consolidation and still having its signals
re-attributed by Google. Shipping a crawl-path change into that, at the end of a
long session, risks more than the 568 KB costs.

When it is picked up, the low-risk order is:
1. Trim the query first — select only the image asset reference rather than the
   whole `mainImage` object, and drop relations the cards do not render. This is
   payload-only and changes no URLs.
2. Measure again. If that alone gets it under ~150 KB, stop.
3. Only then consider pagination, and keep every post reachable from a crawlable
   link, not just from the sitemap.

---

## 2026-07-31 — Striking-distance pass: the constraint is on-page, not authority
<!-- added 2026-07-31 (Scout, #owned-sites) — measured GSC + live SERP -->

**Sources.** GSC `sc-domain:agedleadsales.com`, `2026-07-01 → 2026-07-28`, `dataState: final`, read via
the `brsg-analytics-reader` WIF path (the `gsc` MCP connector returns 403 on this property — use the
Vercel-OIDC route). Ahrefs `serp-overview`, keyword `aged insurance leads`, country `us`, 2026-07-31.
Ahrefs `site-explorer-domain-rating`, `agedleadsales.com`, 2026-07-31.

### The headline: a DR-0 domain outranks us, twice

`agedleadsales.com` **DR 4.1**. Live top-10 for `aged insurance leads` — the term we sit at position
10.7 on:

| Pos | Domain | DR | Refdomains |
|---:|---|---:|---:|
| 1 | agedleadstore.com | 33 | 519 |
| 2 | reddit.com (3 sitelinks + "more results") | 95 | — |
| **3** | **secondchanceleads.com** | **0** | 146 |
| 4 | badassinsuranceleads.com | 15 | 398 |
| 5 | youtube.com (video) | 99 | — |
| 6 | agents.smartfinancial.com | 69 | 1 |
| 9 | leadheroes.com | 28 | 2 |
| **10** | **agedinsuranceleads.com** | **0** | 371 |

Two DR-0 domains hold top-10 positions. Position 6 is a DR-69 subdomain with **1 referring domain**
to the ranking page. **Authority is not what separates us from page one on this cluster.**

This contradicts the 2026-07-14 anchor below, which states "Authority is the binding traffic
constraint." That claim does not survive the SERP for these queries. It may still hold as a *defensive*
argument for the disavow — a toxic-backlink attack is a different problem from needing more links to
rank — but the disavow should not be justified as the unlock for this traffic, because it isn't.

### CTR ceiling — read before forecasting any of this

This SERP is not a clean ten blue links. Position 2 is a Reddit block carrying three sitelinks plus a
"More results from reddit.com" link; position 5 is a YouTube video thumbnail; position 8 is a
discussions block (Reddit + insurance-forums); position 10 expands four sitelinks. A commercial result
at position 8–13 here sits below a forum block, a video, and a discussions module. Measured CTR on our
best position in this set — 1.47% at position 6.3 — is consistent with that, not with a clean SERP's
~8–10%. Model the ceiling from this environment, not from a generic CTR curve.

### Defect — five pages competing for one query

Query → pages, same GSC pull. Every one of these is one query split across multiple URLs:

| Query | Impr | Pages competing | Best pos |
|---|---:|---|---:|
| `aged leads` | 162 | `/providers` (8.0), `/glossary` (13.8), `/compare/aged-lead-store-vs-need-a-lead` (22.0), `/` (29.6), `/guides` (39.0) | 8.0 |
| `aged insurance leads` | 169 | `/lead-types/insurance-leads` (10.7), `/providers` (12.8), `/` (38.9) | 10.7 |
| `aged life insurance leads` | 124 | `/providers` (15.0), `/lead-types/insurance-leads` (26.4), `/lead-types/iul-leads` (35.8) | 15.0 |
| `aged final expense leads` | 137 | `/providers/best/final-expense` (8.9), `/lead-types/final-expense-leads` (25.8), `/glossary` (29.5) | 8.9 |

`/providers` and `/glossary` are absorbing impressions on commercial queries that the specific
`/lead-types/*` page should own. Fix is internal-linking and on-page intent separation, not new content.

- [ ] **P1 — Resolve query cannibalization on the four terms above.** Pick one canonical target per
  query, point internal anchors at it, and differentiate the competing pages' titles/H1s so they stop
  bidding against each other. Highest-impression cluster on the site.
  **HELD until GSC reports — do not action before ~2026-08-24.** Reviewed 2026-08-13 and deliberately
  left open. Two reasons, and the second is the binding one:
  1. This table is a **pre-consolidation** read. It was pulled 2026-07-31 against `agedleadsales.com`,
     three days before the two domains merged on 08-03. The per-URL impression split it describes is
     not necessarily the split that exists now.
  2. The 2026-08-05 entry above already ruled on this class of work: consolidating two domains'
     authority is precisely the intervention that moves these pages, and stacking speculative on-page
     changes now contaminates the only clean read we get of whether the merge worked. That entry says
     *"Do not act on either yet, and that is the finding."* It applies here for the same reason.
  Note this is a **different** finding from the slug-token cannibalization retracted on 2026-08-05 —
  that one was destinations the merge resolved, mistaken for competition it created. This one is
  query-level with real per-URL positions, so it is likely real. Re-pull the same query→page table from
  `sc-domain:workagedleads.com` once it reports, confirm the collisions survived the merge, and only
  then pick canonical targets.
  2026-11-14: the hold has lapsed (GSC has reported since 08-14). Two of four done in PR #78
  (`aged leads` → `/`, `aged insurance leads` → `/lead-types/insurance-leads`). Page titles are
  code-owned and already intent-split (`/providers` "Aged Lead Providers: 15+ Rated & Compared",
  hubs "Aged X Leads – …"). What remains is link edits inside Sanity post bodies — proposed in
  the 2026-11-14 P1-sweep PR under "Content edits for Bill to approve"; left open until approved.

### Defect — apex/www host split on a ranking page

`iul leads` (105 impr, pos 16.0) returns **both hosts of the same page** in GSC:
`https://agedleadsales.com/blog/iul-leads-financial-advisors-playbook` (69 impr, pos 12.2) and
`https://www.agedleadsales.com/blog/iul-leads-financial-advisors-playbook` (19 impr, pos 15.1).
Same split pattern found on proinvestorhub.com the same day.

- [x] **P1 — Confirm the www → apex redirect and canonical on this route. DONE 2026-08-13 — already
  correct, no change needed.** Probed all four hosts on this exact path; every one converges on the
  apex and the served canonical is self-referential:
  | host | | |
  |---|---|---|
  | `www.workagedleads.com` | 308 | → apex |
  | `www.agedleadsales.com` | 301 | → apex |
  | `agedleadsales.com` | 301 | → apex |
  | `workagedleads.com` | 200 | `<link rel="canonical" href="https://workagedleads.com/blog/iul-leads-financial-advisors-playbook">` |
  The two hosts in the GSC row were the retired property's recrawl lag, not a live split — the signals
  are not being divided today. Nothing to fix; reindexing will resolve on its own as the old property
  ages out. Worth remembering that a GSC row can describe a state that no longer exists, which is the
  same trap as the truncated-metadata batch above.

### RESOLVED 2026-07-31 — D6 answered, and the opportunity is smaller than I filed it

Bill unblocked D6 in `#owned-sites` 2026-07-31 15:52 UTC: honest objective reviews of companies with
active engagements are fine, affiliate disclosures are in place. **Measured what the unblock actually
buys, and it is much less than the impression count suggested.**

**The pages already exist and already rank.** No build required. GSC page dimension,
`sc-domain:agedleadsales.com`, `2026-07-01 → 07-28`, `dataState: final`:

| Query | Impr | Clicks | Best page | Pos |
|---|---:|---:|---|---:|
| `aged lead store` | 244 | **4** | `/blog/aged-lead-store-review-2026` | 6.0 |
| | 92 | 1 | `/providers` | 7.5 |
| `agedleadstore` | 93 | **0** | `/blog/aged-lead-store-review-2026` | 6.7 |
| `aged leads store` | 19 | 1 | `/providers/aged-lead-store` | 5.2 |
| `lead heroes` | 66 | **0** | `www.`/providers/lead-heroes | 7.6 |
| `badass insurance leads` | 56 | **0** | `/providers/badass-insurance-leads` | 6.5 |
| `the leads warehouse` | 37 | 2 | `/compare/aged-lead-store-vs-the-leads-warehouse` | 7.4 |
| `lead warehouse` | 53 | 0 | `/compare/aged-lead-store-vs-the-leads-warehouse` | 12.4 |

**~620 impressions produced roughly 10 clicks. 1.6% CTR at an average position of 6–8.**

### Why — the SERP, not the pages

Ahrefs `serp-overview`, `lead heroes`, US, 2026-07-31. Above our position-7.6 result sit:

1. `leadheroes.com` **plus five sitelinks** — the brand owns the entire top block
2. an insurance-forums thread
3. a People Also Ask block (4 questions)
4. two more discussion results
5. BBB profile (DR 93)
6. LinkedIn (DR 99)
7. a competitor review site

These are **navigational** queries. Someone typing `lead heroes` is going to leadheroes.com, and the
brand's own six-link block answers them before anything else renders. Zero clicks from 66 impressions
is what that SERP predicts, not an underperformance to fix. Position is not the constraint and no
title rewrite moves it much.

**Correction to my own 2026-07-31 filing.** I wrote that "~620 impressions per 28 days sit behind that
one line of policy" and ranked D6 first for this site. The impressions are real; the traffic behind
them is not. Measured, this cluster is worth ~10 clicks a month and is capped by query intent.

### The better target was never blocked

The generic category cluster needs no policy answer, carries comparable impressions, and sits in a
SERP where **two DR-0 domains hold top-10** — commercial intent, movable positions:

`aged insurance leads` 169 · `aged leads` 162 · `aged final expense leads` 137 ·
`aged life insurance leads` 124 · `aged health insurance leads` 96 · `aged medicare leads` 49 ·
`aged auto insurance leads` 40.

- [x] **P1 — Work the generic cluster first.** It was available all morning and did not need D6.
  RESOLVED 2026-11-14: PR #78 worked the three largest (`aged leads`, `aged insurance leads`,
  `iul leads`). The rest already lead with the exact query: lead-type `seo.metaTitle` is null in
  Sanity for every hub, so the code titles in `data/lead-types.ts` are live —
  "Aged Final Expense Leads – Affordable Burial Leads", "Aged Health Insurance Leads – Working ACA
  Between OEP", "Aged Medicare Leads – Affordable Medicare Supplement Leads", "Aged Auto Insurance
  Leads – Working the Renewal Clock". `aged life insurance leads` is a declared secondary keyword
  of the life-insurance hub, which deliberately targets the head term. Optional hero-copy edits
  (Sanity `shortDescription`) are in the sweep PR's content-edit list.

### Two corrections to earlier items in this section

- [x] ~~**P1 — Confirm the www → apex redirect and canonical** on the IUL route~~ — **not a defect.**
  Verified 2026-07-31: `www.agedleadsales.com/blog/iul-leads-financial-advisors-playbook` returns
  **308** to the apex, and the apex page carries a correct self-referential canonical and `og:url`.
  Configuration is right; Google is holding stale `www` rows and consolidating. Same shape as the
  billricestrategy 301 — no action, recheck rather than "fix."
- [ ] **P2 — The www split is broader than one blog post.** `lead heroes` earns its 66 impressions on
  `https://www.agedleadsales.com/providers/lead-heroes`. Worth a sitewide sweep of which paths still
  surface on `www`, since the redirect is correct and this is purely index lag.

### Superseded — the original framing of this section

### Blocked — the single biggest opportunity needs a policy answer first

The largest striking-distance query on this site is **`aged lead store` — 340 impressions, position
6.3, 1.47% CTR**, plus `agedleadstore` (149 impr, pos 9.1) and `aged leads store` (64 impr, pos 6.6).
The cluster also includes `lead heroes` (70), `badass insurance leads` (66), `lead warehouse` (61),
`the leads warehouse` (48) — competitor brand navigational terms. A `/compare/aged-lead-store-vs-need-a-lead`
page already ranks (pos 22.0 on `aged leads`).

This is **D6** in `~/.buzz/PLANS/brsg/owned-sites/DECISIONS_FOR_BILL.md` — editorial policy on owned-site
coverage of companies Bill's businesses also work with. ~620 impressions/28d sit behind that one line.
Do not build here until it lands.

### Ready to work with no decision required

`aged insurance leads` (169), `aged leads` (162), `aged final expense leads` (137), `aged life insurance
leads` (124), `aged health insurance leads` (96, pos 13.0), `aged medicare leads` (49, pos 11.0),
`aged auto insurance leads` (40, pos 8.1). All generic category terms, no brand conflict, all in
striking distance, all pointing at pages that already exist.

---

## 2026-07-14 — Portfolio Performance Report priority anchor
<!-- added 2026-07-14 — cross-portfolio prioritization from the BRSG Portfolio Performance Report (daily) -->

**Report snapshot (2026-07-14 daily):** 450 sessions (+172.8%), **27 conv** — the portfolio's #1 converter.

**Portfolio rank: TIER 1 — the top converter** (AEO-driven; AI assistants are the best-converting channel). Scale and defend. Work these existing items, in order:

1. **Refresh + resubmit the disavow** (P0 below) — the toxic-backlink attack is ongoing and this is **overdue** (due ~2026-07-06); avg position is eroding 25.4 → 32.3. Diff new spam domains; Bill re-submits in GSC. Authority is the binding traffic constraint — this stops the bleeding.
2. **Feature the pipeline calculator** (P1 below) — it converted **9 of 16 sessions** (best on-site converter) but is starved of traffic; surface in nav/homepage + internal-link + add SoftwareApplication/HowTo JSON-LD so it also *earns* organic landings.
3. **Ship the next `/compare/*` AEO wave** (P1 below) — AI Assistants are the best-converting channel and cite this format; build `final-expense-vs-term-life`, `medicare-vs-aca` on the existing template.
4. **Attribution config fix** (P1 below) — enable bot exclusion + referral review so the 66% "Direct" stops poisoning measurement (fleet pattern; code is already correct).

*Next content lever: build the 3 missing lead-type guides — health-insurance, debt-settlement, mca-business-loans (P1 below).*

---

## 2026-07-21 — /brsg-session

**Position has recovered, contrary to the 07-14 note above.** Rolling-7d GSC: avg position **32.3 (Jun 25) → 21.76**, CTR **0.62% → 1.02%**, clicks **14 → 33**. Impressions cooled (4,122 → 3,223). Ahrefs: DR low, org traffic ~26/mo, 6 organic keywords.

Shipped this session:

- [x] **Disavow refreshed to 291 domains (+41).** Attack still running — refdomains **252 (06-29) → 292 (07-20)**, and **all 70 newest referring domains were spam** (100% of the new cohort). Bill uploaded to GSC 2026-07-21. The P0 above is now closed.
- [x] **SERP title truncation fixed sitewide — 34 → 241 of 246 pages within budget (`e74d4bd`).** 212 of 246 titles exceeded the ~60-char SERP budget. Root cause was the layout `title.template` appending `" | Aged Lead Sales"` to every page; that suffix was redundant because the `WebSite`/`Organization` schema already declares the site name, which is how Google sources it. Dropping it alone recovered 182 pages. Also shortened the compare/glossary/provider-review templated patterns, fixed the worst hardcoded titles, and added "aged" — the money term — to the `/providers` title, which omitted it entirely. Verified by measuring all 246 sitemap URLs against a served production build.
- [x] **Toxic-backlink classification automated (`2cb7742`).** `lib/backlink-audit/spam-classifier.ts` + `scripts/refresh-disavow.ts` + 37 tests (`npm test`, `node:test`, no new dependency). Validated against real ground truth — the 291 domains already disavowed: calls **none** of them clean, auto-flags **270 (93%)**, defers 21 genuinely ambiguous ones to a human. Deliberately three-verdict, not boolean: wrongly disavowing a genuine editorial link costs far more than deferring one spam domain.
- [x] **Comparison cluster de-orphaned (`091a03a`).** A crawl of the in-body link graph found **16 of 17 indexed `/compare/*` pages had zero inbound links from anywhere** — not nav, footer, or body — reachable only via the sitemap. Root cause: `ProviderCompareSelector` is a `<select>` + `router.push()`, emitting no `<a href>`, and no `/compare` index existed. This matters because it is the **best-converting format on the site** — `/compare/aged-lead-store-vs-the-leads-warehouse` ranks position 9 at **5.97% CTR**, the highest of any page, on zero internal link equity. Built the `/compare` hub (17 comparisons, ItemList + breadcrumb JSON-LD, in sitemap), added it to header nav + footer, and gave every provider page a real crawlable link to its own head-to-head.

Still open from this session:

- [x] **5 Sanity post metaTitles/metaDescriptions still truncated — needs Bill's go-ahead.** A seeding pass clipped values to satisfy the 60/160 caps, shipping **10 metaTitles and 12 metaDescriptions ending in a literal `…`** that Google renders verbatim — including the site's best-ranked page (`aged-lead-store-review-2026`, position 6.25, 251 impr/wk, showing "…Honest Assessment of the L…" and converting at only **1.59% CTR** against a ~5–7% expectation for that position). Rewrites are drafted and dry-run clean for all 17 affected posts; the write was blocked by the permission gate because it mutates live production Sanity. Rollback snapshot of all 76 posts saved. The schema now rejects ellipsis-terminated values so this cannot recur. **Action:** approve the Sanity write. *Effort: S.*
  **CLOSED 2026-08-13 — already done, no approval needed.** Re-measured every published post in
  production Sanity: **154 posts, 0 ellipsis-terminated `metaTitle`, `metaDescription` or `title`.**
  The write went in with `a2b0b1c`; this entry was never updated, so it sat here asking Bill to approve
  something that had already shipped. It was very nearly picked up as a session's focus. When an item
  says "blocked on approval", re-measure before acting on it — the block may have lifted months ago.
  **RESOLVED 2026-11-14 — re-measured again, nothing to rewrite.** Bill gave the go-ahead today, so the
  dataset was measured before writing anything: all 163 documents carrying `seo.metaTitle` /
  `seo.metaDescription` in `p7rbtajg/production`, plus every published `title` and `excerpt` — **0 contain
  `…`**, 0 published titles over 60, 0 descriptions over 160, 0 descriptions ending mid-sentence. The only
  over-length values are the three legacy playbook **drafts** (`drafts.pb-*`), which are unpublished on
  purpose (see CLAUDE.md) and were left alone. Checkbox ticked so the item stops asking for approval.

## Done

<!-- added 2026-06-13 editorial session -->
- [x] **5 editorial briefs written + published** (2026-06-13) — wrote and published the five ready weeks-13–14 briefs from the email-program audit, in Bill's voice (answer-first H2s for AEO, glossary auto-links, branded Unsplash featured images, no fabricated stats; legal/AI-voice claims web-verified + cited): **Call Recording Consent by State** (`/blog/aged-lead-call-recording-consent-by-state`), **The Aged-Lead Sales Stack Under $100/Month** (`/blog/aged-lead-sales-stack-under-100-month`, affiliate angle), **Put Your CRM on Autopilot: AI Agents + MCP** (`/blog/crm-autopilot-ai-agents-mcp-aged-leads`), **Scheduling Links That Book + Capture Consent** (`/blog/scheduling-links-book-calls-capture-consent`), **AI Guardrails for Aged-Lead Agents** (`/blog/ai-guardrails-aged-lead-agents`). Source markdown in `content/drafts-2026-06-13/`; published via `scripts/publish-drafts-2026-06-13.ts` with **staggered publishedAt** (recent Mon/Wed/Fri, not a same-day batch — avoids the scaled-content signal). Calendar entries flipped to `status:"published"`. Posts are 71→76. Verified live (200, og:image, Article JSON-LD).
- [x] **Re-angled the Week-9 SMS brief to consent-first** (2026-06-13) — `aged-lead-text-sms-strategies` brief in `data/editorial-calendar.ts` flipped from pro-SMS to "earn consent first" (cold-texting purchased/aged data is a TCPA trap; email-first warm-up + booking-link consent capture, then text only the consented). Bill's call.

<!-- added 2026-06-13 content session -->
- [x] **AEO comparison cluster — 3 new answer pages** (2026-06-13) — built a reusable `components/comparison-page.tsx` (answer-first intro + Key Takeaways + real `<table>` + visible FAQ mirrored by FAQPage JSON-LD + cite + RelatedLinks) and shipped three coded `/compare/*` routes targeting high-intent informational queries (AEO play — ChatGPT is the #3 traffic source): **`/compare/aged-vs-real-time-leads`** (the category's #1 comparison query — data-backed table from `data/verticals.ts` benchmark defaults, per-vertical not averaged), **`/compare/medicare-advantage-vs-supplement`**, **`/compare/iul-vs-term-life`**. Each funnels to its lead-type page (medicare-leads / iul-leads) and is in the sitemap. Cross-linked from the `/price-index` hero + `/lead-types` hub. No fabricated stats (real benchmark defaults; product facts only; close-rate formatter shows 1 decimal so 1.5% doesn't round to 2%).
- [x] **Thin programmatic pages noindexed (not fabricated)** (2026-06-13) — every vertical auto-generates a `/price-index/[vertical]` and `/providers/best/[vertical]` page, but the niche ones were live, sitemapped thin content. Added a shared `lib/benchmark-coverage.ts` (Sanity-or-static load + `providersSampled>=2` trust gate, React-`cache()`d so page+metadata share one fetch). Now noindex+follow and dropped from the sitemap when a price-index vertical has no reliable benchmark (`homeowners-insurance`, `long-term-care`, `auto-warranty`, `home-security`, `annuity-iul`) or a best-providers vertical has <2 reviewed providers (`home-security`, `long-term-care`, `auto-warranty`, `annuity-iul`). They auto-rejoin the index when real data/providers are added. Verified in built HTML + live sitemap.
- [x] **SSDI compare-link bug fixed** (2026-06-13) — `ssdi-leads` pointed to `/providers/best/life-insurance` in both `data/lead-types.ts` (`getCompareUrl`) and `data/lead-type-vertical-map.ts`. SSDI is disability-legal; corrected both to `/providers/best/legal` (same as `mva-leads`; legal vertical has 3 providers). Verified live: SSDI page CTA now resolves to `/providers/best/legal`.

<!-- added 2026-06-08 /brsg-session -->
- [x] **ALL 9 lead-type pages now have full content-depth passes** (2026-06-09) — every `/lead-types/*` page expanded from ~700 to ~2,600 words to match mortgage: each got 6 deep-dive H2 sections + 2 added best practices + 5-6 long-tail FAQs (site-wide FAQ count ~40→72). Verticals: mortgage (2026-06-08), insurance, home-services, final-expense, medicare, IUL, SSDI, MVA, solar. Each deep-dive is vertical-specific — e.g. home-services "neighborhood play" + cost-per-booked-estimate; final-expense persistency + door-knock economics; **medicare conservative CMS section** (permission-to-contact, Scope of Appointment, call recording, TPMO disclaimer); **SSDI + MVA legal-advertising/anti-solicitation** sections (no outcome guarantees, bar rules, contingency math); IUL suitability/illustration honesty; solar FTC savings-claim + Reg Z. Renders via generic `[slug]/page.tsx` (deepDive + static glossary linker). No fabricated stats (reused existing cost/conversion ranges; illustrative math labeled). Goal: Helpful Content / YMYL depth + long-tail FAQ-schema capture (traffic + CTR).
- [x] **Insurance-leads content-depth pass** (2026-06-08) — first vertical after mortgage; cross-sell multiplier + cost-per-bound-policy math. (Now part of the full 9-vertical pass above.)
- [x] **Removed dead OPENAI_API_KEY from .env.example** (2026-06-08) — zero code references; site uses ANTHROPIC_API_KEY. Confirmed not used.
- [x] **Glossary internal-linking — static path + crawlable** (2026-06-08) — (1) lead-type CMS body passes `glossary` to `PortableText` (wired but dormant; no lead-type has a CMS body yet); (2) new static-path linker (`components/glossary-static.tsx`) auto-links the 77-term glossary in lead-type static content (`data/lead-types.ts`) including the deep-dive sections; (3) **fixed a site-wide SEO gap** — `GlossaryTooltip` only rendered its `/glossary/` link inside the hover popup (not in SSR HTML, so uncrawlable); the inline term is now an always-rendered `<a href="/glossary/…">`, making every glossary mention a real internal link across blog, playbook, and lead-type pages.
- [x] **Mortgage-leads content-depth pass** (2026-06-08) — `/lead-types/mortgage-leads` expanded ~700 → ~2,600 words: 6 deep-dive H2 sections, 5 new long-tail FAQs (FAQ schema auto-extends), 2 best practices. Addresses Helpful Content / YMYL thin-content risk.
- [x] **Provider-count overclaim fix** (2026-06-08) — homepage stat and affiliate-disclosure said "50+ providers reviewed" but the directory has 15 (`data/providers.ts`) and `/providers` says "15+". Corrected both to "15+".

- [x] **Privacy Policy page** (`/privacy`) — legal requirement, trust signal
- [x] **Terms of Service page** (`/terms`) — legal requirement
- [x] **Affiliate Disclosure page** (`/affiliate-disclosure`) — standalone FTC-compliant route
- [x] **Editorial Process page** (`/editorial-process`) — E-E-A-T trust page, linked from article footer
- [x] **Breadcrumbs component** — reusable visual breadcrumb nav, deployed on blog posts
- [x] **ScrollProgressBar component** — thin progress bar on article pages showing read progress
- [x] **IndexNow integration** — API key hosted, utility created, fires on content publish
- [x] **Footer legal links** — Privacy, Terms, Affiliate Disclosure, Editorial Process added
- [x] **Sitemap updated** — new pages included with correct priorities
- [x] **Glossary Tooltip Integration** (2026-04-08) — auto-links first occurrence of 77 glossary terms in blog + playbook articles with hover tooltips
- [x] **Blog Category Hub Pages** (2026-04-08) — `/blog/category/[slug]` with filtered posts, breadcrumbs, JSON-LD, sitemap
- [x] **Contact Page** (2026-04-08) — `/contact` with Resend-powered form, added to footer + sitemap
- [x] **StickyTOC** (2026-04-08) — floating desktop sidebar with IntersectionObserver active-section highlighting, h2 IDs on all articles
- [x] **KeyTakeawayBox** (2026-04-08) — TL;DR summary card from excerpt, deployed on blog + playbook pages
- [x] **ContentCheckpoint** (2026-04-08) — stat callout cards interleaved with mid-article CTAs in PortableText
- [x] **NextReadBar** (2026-04-08) — sticky bottom bar at 60% scroll with related article, dismissible
- [x] **ExpandableDeepDive** (2026-04-08) — styled details/summary component
- [x] **Statistics/Data Page** (2026-04-08) — `/blog/aged-lead-industry-statistics` link-magnet with pricing tables, provider landscape, lead economics, Cite This buttons, Dataset JSON-LD

- [x] **Breadcrumbs on all sub-pages** (2026-04-08) — Breadcrumbs component with dark variant, deployed on playbooks, lead-types, guides, glossary, providers, and all 5 calculator pages
- [x] **Speakable Schema** (2026-04-08) — SpeakableSpecification in Article JSON-LD targeting key-takeaway-box and first paragraph after H2s
- [x] **Answer-First Paragraphs** (2026-04-08) — Content cron prompt updated to generate 40-60 word direct answers after every H2
- [x] **Calculator Embed Codes** (2026-04-08) — Embed routes at /calculators/[name]/embed (no site chrome), EmbedCode component with copy-to-clipboard on all 5 calculator pages, UTM-tracked attribution links
- [x] **Article Credibility Enhancements** (2026-04-08) — CredibilityBadges component with updated date, "Human-reviewed" badge, "Reviewed by" line on blog + playbook pages
- [x] **CopyableStatCard + ShareableQuote** (2026-04-08) — Copyable stat cards with rich clipboard + attribution, shareable quotes with LinkedIn/X/copy buttons, deployed on statistics page
- [x] **Resources Hub Page** (2026-04-08) — `/resources` with all 5 lead magnet PDFs, email-gated downloads, calculator links, added to footer + sitemap
- [x] **Cite This on price-index + comparisons** (2026-04-08) — CiteThisButton deployed on price-index overview, vertical detail, and comparison pages
- [x] **Author Hub Page** (2026-04-08) — `/authors` with Bill Rice profile, article/playbook counts, credentials, LinkedIn link
- [x] **Reaction Buttons** (2026-04-08) — "Helpful / Surprising / Need More Detail" on blog + playbook pages, tracked via GTM events

---

## P1 — High Value Engagement & Traffic

### Homepage Social Proof & Trust Indicators — DONE 2026-06-09 (verified)
- [x] **Trust indicators** — `TrustStrip` in the hero shows real E-E-A-T signals (30+ yrs expertise, independent reviews, human-reviewed, transparent disclosure), each linking to the page that backs it.
- [x] **Positioning statement** — present in the hero.
- [n/a] **Subscriber count** — deliberately omitted. Real Resend audience is only **39** contacts (verified live); "Join 39" undercuts trust and we won't fabricate a bigger number. Revisit once the list is materially larger.
- [n/a] **Testimonial cards** — no real testimonials exist; won't fabricate. Add when genuine ones are collected.
- **Impact:** Conversion rate, trust, first-impression authority

---

## P1 — SEO & Visibility

<!-- added 2026-06-08 /brsg-session — cold-start diagnosis: Ahrefs DR 2.5, ~0 backlinks, 1 organic keyword, ~2 organic visits/mo. Site is fully indexed (30+ pages) but does not rank. Ceiling is authority + content depth, not technical SEO. SEO audit score 78/100 (2026-06-03). -->

<!-- Authority / backlink campaign removed 2026-06-09 — tracked as offline work (digital PR, HARO, partnerships), not a repo task. -->

### /website-audit 2026-06-13 — fresh GSC/GA4 findings <!-- added 2026-06-13 /website-audit -->
Site is healthy and the on-page work is largely done (FAQPage schema present, data-led internal-linking pass shipped 2026-06-09, AEO clusters live, thin pages noindexed). 28d snapshot: GA4 597 sessions (+36%), **15 key events / 1.01% conv**, GSC 43 clicks, impressions **+252% to 5,730**, avg pos 32.4, DR 2.5. The remaining levers are position (a cluster of money pages just off page 1) and the two things converting best (AI assistants + the pipeline calculator). Concrete, fresh-data items:
- [x] **Next internal-linking pass: target the off-page-1 cluster.** Highest-impression pages stuck at pos 12-38: **/providers** (454 impr, pos 18), **/blog** (392 impr, pos 12), **/lead-types/insurance-leads** (378 impr, pos 33), **/lead-types/iul-leads** (145 impr, pos 24). Point more internal links (descriptive anchors) at these from high-traffic pages — same play as the 2026-06-09 pass, refreshed against this month's GSC. RESOLVED 2026-11-14: the refreshed pass shipped today in PR #78 against the 2026-11-14 GSC snapshot (homepage answer block with descriptive links to `/lead-types` and `/providers`; IUL hub linked from three posts; "Related lead types" block on every guide). The four 06-13 targets are also linked sitewide from header nav and footer (`components/header.tsx`, `components/footer.tsx`). The 06-13 positions were agedleadsales.com data and no longer describe the merged site; the stuck pages now are `/lead-types/life-insurance-leads` (47.9) and `/lead-types/insurance-leads` (46.2), both covered by #78.
- [x] **Feature the pipeline calculator more prominently** — it converted **9 of 16 sessions** (`/calculators/pipeline-calculator`), by far the best on-site converter, but barely gets traffic. Surface it in nav/homepage + internal-link from the lead-type and playbook pages. <!-- 2026-06-19 confirmed: still the top converter (pipeline 9/15 key events = 6.7%, ROI calc 4.8%) and still under-fed by organic. Pair the placement work with calculator SEO: add `SoftwareApplication`/`HowTo` JSON-LD + target "aged lead ROI calculator"-type queries so the page also *earns* organic landings, not just receives internal traffic. --> RESOLVED 2026-11-14 (this PR): most of the placement had already shipped — header nav "Calculators", a "Most-used tool" block on the homepage, links from every lead-type guide, blog post, start-here and resources, and `WebApplication` (a `SoftwareApplication` subtype) + FAQPage JSON-LD on the page. The one gap was the flagship playbook path: the thank-you page now links "Run your numbers in the Pipeline Volume Calculator" at step 2 (the Worksheet 1 step it automates). Every calculator now fires GA4 `calculator_use` on first input, so its conversions are measurable. HowTo JSON-LD skipped: Google retired HowTo rich results in 2023. Verify live after merge.
- [ ] **Lean harder into AEO** — the **AI-Assistant channel drove 10 of 15 key events** (ChatGPT). The comparison/provider content is exactly what assistants cite; keep expanding the `/compare/*` cluster and provider-directory depth. Biggest ROI front and doesn't need authority. (2026-11-14 sweep: net-new content — see the concrete wave at the "Next `/compare/*` AEO wave" item.)
- [ ] **Attribution (config only — code already correct):** analytics already loads `afterInteractive`, so the 66% "Direct" is GA4/GTM-config + bots, not code. In GA4 Admin enable bot-traffic exclusion + review referral exclusions; confirm the GTM page_view tag isn't dropping `page_referrer`. Fleet-wide BRSG pattern (proinvestorhub shows it too) — worth fixing once at the template/container level. NEEDS BILL 2026-11-14: GA4 property 528489903 → Admin → Data streams → web stream → Configure tag settings → Show more → **List unwanted referrals**: add `agedleadstore.com` (readers returning from the store otherwise start a new "referral" session); then Admin → Data settings → Data filters → confirm the "Internal traffic" filter is **Active** (GA4 excludes known bots automatically; there is no toggle). In GTM, open the GA4 Configuration/Google tag and confirm no field overrides `page_referrer`.
- [ ] **Stretch:** push "aged lead store reviews" (already pos 8, page 1) toward top-3 / featured snippet — high-intent buyer query that already converts. 2026-11-14: metaTitle is already "Aged Lead Store Review 2026: Pricing, Quality & Verdict". The snippet blocker is the body: the "Quick verdict" H2 is followed by a rating fragment, not a sentence answer. Exact edit proposed in the 2026-11-14 P1-sweep PR ("Content edits for Bill to approve"); open until approved.

### /website-audit 2026-06-19 — refresh + new findings <!-- added 2026-06-19 /website-audit -->
Deep audit (live GA4 528489903 + GSC + PSI + Ahrefs). **28d snapshot (May 22 – Jun 18):** GA4 595 sessions (+8.4%), **43 key events / 2.18% conv** (tracking now firing, was 0); GSC **47 clicks / 6,725 impr (+198%) / 0.70% CTR / avg pos 32.1 (down from 25.4)**; PSI mobile 96–100 / desktop 100 (performance is **not** a lever); DR **3.3**, 164 referring domains. The four 2026-06-13 items above (internal-linking cluster, feature the pipeline calculator, lean into AEO, attribution config, push "aged lead store reviews") are **re-confirmed by this month's data and remain open — not re-listed here.** Report: `~/website-audits/agedleadsales.com-2026-06-19.html`. New, non-duplicate items, ordered by impact on the primary goals (traffic, then conversion):

**P0 — Defend authority (traffic is actively eroding)**
- [ ] **Refresh the disavow — the toxic-backlink attack is ongoing.** The profile is ~95% spam PBNs at DR 3.3, and **fresh spam landed *after* the 2026-05 disavow** (e.g. `rankyour.website` DR74 seen 2026-05-08, `linkrankboost.shop` 2026-05-13, `ranklinkpro.shop` 2026-05-15, plus a cluster of `*.shop` link farms). This correlates with avg position sliding **25.4 → 32.1** while impressions tripled. **Action:** pull current referring domains (Ahrefs), diff against the existing disavow, add the new spam domains, and Bill re-submits in GSC (URL-prefix property). Authority is the binding constraint on traffic — this stops the bleeding. *Effort: S (Bill submits).* <!-- 2026-06-29 /brsg-session: re-flagged — the ~monthly re-audit cadence makes this DUE ~2026-07-06 (≈1 week out, per project memory). Latest rolling-7d GSC (2026-06-25): 14 clk / 2,267 impr / 0.62% CTR / avg pos 32.3 — position still eroding, so the diff-and-resubmit above is the next concrete step. --> <!-- 2026-07-03 /brsg-session: DIFF DONE. Pulled 249 live referring domains (Ahrefs), diffed vs the 146 disavowed + 4-domain whitelist → 106 new un-disavowed. Added **104** to `data/backlink-audit/disavow.txt` (now 250 domains): 101 Ahrefs-spam-flagged (new `outrank-hq`/`rank-forge`/`link-baron` PBN clusters + `.shop` link farms) + a 3-domain content-mirror cluster (`mav.website`/`rocketq.link`/`rquote.link` all duplicating one editorial post). KEPT 2 genuine editorial links (NOT disavowed): **hiremav.com** (DR 28, Mav recruiting-AI blog citing the ALS founder) and **startkadence.com** (unique substantive posts w/ contextual anchors). File ready for Bill to upload in GSC → then this item closes. --> <!-- 2026-07-21 /brsg-session: REFRESHED AGAIN — the 2026-07-03 file was never uploaded and went stale. Ahrefs refdomains history confirms the attack is **still running**: 252 (2026-06-29) → **292 (2026-07-20)**, and **all 70 newest referring domains are spam** (100% of the new cohort). Diffed → **41** not-yet-disavowed, all unambiguous link-farm spam (`.store`/`.shop`/`.site` SEO-jargon naming; `outrank-hq`, `link-baron`, `seoexpress` clusters) — **zero judgment calls in this batch**. `data/backlink-audit/disavow.txt` now **291 domains**. Branch rebased onto main. Still blocked on Bill's GSC upload. --> NEEDS BILL 2026-11-14: the 07-21 file was uploaded that day (see the 2026-07-21 session entry), so the refresh this item describes is done; what is open is the **merged** file. Since the 08-03 consolidation the live property is workagedleads.com and a disavow does not follow a 301. Steps: (1) if not already done, upload `data/backlink-audit/disavow-workagedleads.txt` (424 domains, built 2026-08-03) at https://search.google.com/search-console/disavow-links on the URL-prefix property `https://workagedleads.com/`; (2) export Ahrefs → Site Explorer → `workagedleads.com` → Referring domains (CSV) and run `npm run disavow:refresh -- <csv>` for the diff — note the script still writes the agedleadsales `disavow.txt`; append its "Would add" list to `disavow-workagedleads.txt` and re-upload that file.

- [ ] **Make the disavow a recurring task + detection.** Stand up a monthly job that snapshots referring domains and flags new ones matching the spam pattern (`*.shop`/`*.site`/`buybacklinks`/`seoexpress`-style farms) so additions are caught in weeks, not at the next audit. Extend the existing `data/gsc-trend.json` persistence to also record DR + refdomain count for an attack tripwire. *Effort: M.* <!-- 2026-07-03: DETECTION HALF SHIPPED. The `gsc-trend` persistence + tripwire is now a dedicated daily cron (`app/api/cron/gsc-trend`, 12:00 UTC, commits `data/gsc-trend.json`) with a **health-check staleness monitor** (2-day threshold) — closes the observability gap that let the June WIF break freeze the trend silently for 4 days. STILL OPEN: the *referring-domains* snapshot + spam-pattern auto-flag (this refresh was still a manual Ahrefs pull) and recording DR/refdomain count into the tripwire. --> <!-- 2026-07-21 /brsg-session: PRIORITY UP — promote to P0-adjacent. The 18 days between the 07-03 and 07-21 refreshes accrued **41 new spam domains with nothing watching**, which is exactly the failure this item exists to prevent. The auto-flag is also now trivially cheap: the new cohort is 100% machine-classifiable on naming alone — TLD in {.store,.shop,.site,.website,.link} plus SEO-jargon tokens (`link-`, `backlink`, `seo`, `rank`, `outrank-hq`, `link-baron`, `niche-edit`, `do-follow`, `serp-boost`). A weekly Ahrefs refdomains pull + regex flag + append-to-disavow would have caught all 41 automatically. *Effort: S-M now, not M.* --> NEEDS BILL 2026-11-14: the classifier (`lib/backlink-audit/spam-classifier.ts`) and the diff script exist; the job cannot be built from data the repo has, because nothing the repo can read lists referring domains — the only snapshots are the two 2026-08-03 Ahrefs exports, and the GSC API has no Links endpoint. Step: decide the feed — either add an Ahrefs API v3 key (needs an Ahrefs plan with API units) as `AHREFS_API_KEY` in Vercel so a monthly cron can pull `site-explorer/refdomains` for workagedleads.com and run the classifier, or keep a monthly manual CSV export through `npm run disavow:refresh`. Say which and the cron is a small follow-up.

**P1 — Net-new rankable + AEO surface (traffic, no authority needed)**
- [ ] **Build the missing lead-type guides: `health-insurance`, `debt-settlement`, `mca-business-loans`.** Price data + providers already exist for these but there's no `/lead-types/*` depth page, so the demand is uncaptured. Same ~2,600-word deep-dive + FAQ-schema template as the existing 9 (note `mca-business-loans` is business-purpose/RESPA-exempt — keep the consumer/business framing separate). Net-new commercial pages on existing data. *Effort: M.* (2026-11-14 sweep: net-new long-form — left open. `health-insurance-leads` now exists as a hub in `data/lead-types.ts`; `debt-settlement` and `mca-business-loans` remain.)
- [ ] **Next `/compare/*` AEO wave + "definitive answer" hubs.** AI Assistants are the best-converting channel per session (22 sessions → 10 key events); the `/compare/*` and answer-hub format is exactly what they cite. Build the next high-intent comparisons (`final-expense-vs-term-life`, `medicare-vs-aca`, per-vertical real-time-vs-aged) on the existing `components/comparison-page.tsx`, plus citeable answer hubs for the head questions ("are aged leads worth it", "how old is too old", "best aged lead providers"). *Effort: M.* (Extends the open "lean into AEO" item with concrete deliverables.) (2026-11-14 sweep: net-new long-form — left open.)

**P2 — AEO hygiene, measurement, and long-tail (compounding)**
- [x] **AEO hygiene: add `llms.txt` + audit answer-snippet/speakable coverage.** Confirm each answer-first H2 returns a clean 40–60-word extract and that `speakable` JSON-LD covers the key blocks across blog/lead-type/compare. Cheap, helps the converting channel. *Effort: S.* RESOLVED 2026-11-14 (this PR): `/llms.txt` added (`app/llms.txt/route.ts`, static) — start-here, price index, methodology, every lead-type guide, every provider, comparisons and calculators, generated from the same data the pages render. Speakable audit: blog Articles already declared it (`.key-takeaway-box`, `.prose-wrapper h2 + p`); lead-type guides and both compare templates had none — they now emit a `WebPage` node with `speakable` pointing at the hero definition (`.speakable-answer`), the intro + key takeaways (`components/comparison-page.tsx`), and the recommendation box (`/compare/[a]-vs-[b]`). Per-post 40–60-word extract lengths live in Sanity bodies and are a content pass, not code. Verify live after merge: `curl https://workagedleads.com/llms.txt`.
- [x] **Brand-entity reinforcement (distinct from the Wikidata entry below).** Strengthen `Organization` schema `sameAs` links + consistent NAP/entity signals so Google and assistants resolve "Aged Lead Sales" as a known entity — aids AI citation and the brand SERP. *Effort: S.* RESOLVED 2026-11-14 (this PR): the Organization now has one `@id` (`https://workagedleads.com/#organization`) used as publisher by `WebSite`, every `Article` and the new `WebPage` nodes, and as Bill's `worksFor` — before, it appeared only on the homepage with no @id and the WebSite named the *person* as publisher. Added `alternateName` ["Aged Lead Sales", "How To Work Leads"] (the two consolidated brands), `logo`, `parentOrganization` Bill Rice Strategy Group, `knowsAbout`. `sameAs` is wired but empty on purpose: the brand has no verified profiles of its own, and Bill's personal accounts are not the company — add the Wikidata QID when the Wikidata item (below) exists. Verify live after merge with the Rich Results Test on `/`.
- [ ] **Long-tail vertical answer posts for the pos 50–90 queries** surfacing real impressions: "accident leads" (37 impr, pos 54), "burial insurance leads" (pos 65), "final expense leads" (pos 56), annuity/AEP-Medicare-enrollment terms. Staggered cadence per the content rule. Feeds both organic and AEO. *Effort: M.* (2026-11-14 sweep: net-new long-form — left open.)
- [ ] **Key-event tracking audit + AI-referral segmentation.** Conversion tracking only just started firing (0 → 43 key events) — verify *which* events are wired (calculator completion, playbook download, email signup, the agedleadstore.com outbound = the money conversion) and that none are missing. Then segment AI referrers to explain the gap (chatgpt.com 16 sessions → **0** key events vs copilot.com 6 → **10**); land each AI source on its best-matching answer page. *Effort: M.* Prereq: the open attribution-config fix (line above) so the data is trustworthy. NEEDS BILL 2026-11-14 — wiring audit done in code: since PR #77 (helper had pushed plain arrays gtag.js ignored, so every custom event was dropped until 2026-11-12) the site sends `generate_lead` (flagship signup, lead magnet, contact form — after a successful API response), `newsletter_signup`, `cta_click`, `affiliate_click` / `partner_click` / `outbound_click` (all outbound links, `components/outbound-tracker.tsx`; agedleadstore.com = `affiliate_click`) and `article_reaction`. The one missing conversion, calculator completion, is added in this PR as `calculator_use { calculator }` on all five calculators. Steps in GA4 528489903 → Admin → Events: mark `generate_lead` and `affiliate_click` as Key events (and `calculator_use` if wanted); after ~2 weeks of clean data, run Explore → free form, rows = Session source, filter source contains chatgpt|copilot|perplexity|gemini|claude, values = Sessions + Key events, to redo the AI-referrer split (pre-#77 figures undercounted every custom event).
- [ ] **Track AEO share-of-voice (Ahrefs Brand Radar)** to measure brand mentions in AI answers over time, not just referral sessions — so the AEO investment has a leading indicator. *Effort: S.* NEEDS BILL 2026-11-14: Ahrefs → Brand Radar → add brand "Work Aged Leads" (aliases "Aged Lead Sales", "workagedleads.com") with the provider brands already on `/compare` as competitors; record the monthly AI share-of-voice figure here. Free alternative: Bing Webmaster Tools → AI Performance (WORK-PLAN "Blocked on Bill").

### Content depth for Helpful Content / Dec-2024 Core Update
Audit's #1 high finding: thin affiliate content is demoted post-update.
- [x] **Lead-type pages — DONE 2026-06-09.** All 9 `/lead-types/*` pages expanded to ~2,600 words with deep-dive sections, vertical-specific compliance, and long-tail FAQs.
- [x] **Flagship playbook pages — DONE 2026-06-09.** All 3 `/playbook/{mortgage,insurance,home-services}` conversion landing pages got a below-the-fold SEO depth pass: 4 deep-dive sections each (operator/"build-a-system" intent — deliberately distinct from the lead-types buyer intent to avoid cannibalization), FAQs 3→7, crawlable glossary links, **added the previously-missing FAQ JSON-LD** (CTR rich results), and a second signup form at the bottom so deep-scrollers convert. Hero + form above the fold untouched (conversion preserved). Edited `data/flagship-verticals.ts` + the page component only — NOT `content/flagship-magnet/` markdown, so PDFs are unaffected (flagship:check shows a worktree-mtime false positive; no PDF source changed).
- [ ] **Stretch:** push the highest-impression lead-type pages from ~2,600 to 3,000+ words with original data/visuals once GSC shows which earn impressions. (2026-11-14 sweep: net-new long-form — left open. The two highest-impression guides now are life-insurance (356 impr/7d) and insurance (439).)
- **Impact:** Ranking eligibility + YMYL trust.

### YMYL author-expertise demonstration — DONE 2026-06-09 (verified)
`/about/bill-rice` is already a strong E-E-A-T page: 30+ years, detailed verifiable career (AFOSI special agent → DeepGreen Bank employee #7 → Quicken Loans COO/VP → founder of Kaleidico/BRSG/Verified Vector), `personPageJsonLd` Person schema, and it's linked from the homepage TrustStrip. Articles carry a "Human-reviewed / Reviewed by Bill Rice" credibility line. Considered sufficient for YMYL; optional micro-win later = make the article byline link to the author page.
- **Impact:** YMYL ranking trust.

### FTC affiliate-disclosure prominence — DONE 2026-06-09
Sitewide disclosure already renders above the footer on every page, but it wasn't adjacent to the affiliate CTAs. Added an inline FTC micro-disclosure inside `CtaBanner` (both default + compact variants, affiliate mode only) — "Affiliate link — we may earn a commission at no cost to you, and it never affects our ratings," linking to `/affiliate-disclosure`. `CtaBanner` is the primary affiliate CTA across blog/playbook/lead-type pages, so the disclosure is now clear-and-conspicuous right at the action on every content page.
- **Impact:** Compliance + trust signal.

### Entity SEO — Wikidata Entry (OFFLINE / manual)
Create/claim a Wikidata entry for "Aged Lead Sales" with proper classification. Entity-recognized brands see more AI-sourced traffic. **Note:** like the backlink campaign, this is a manual off-site task, not a repo change — tracked here but executed externally.
- **Impact:** Knowledge graph, AI citation

---

## P2 — Engagement & Retention

### Save for Later (Email-Gated)
Bookmark icon on articles that prompts for email to save to reading list.
- Weekly digest of saved + recommended articles
- **Impact:** Lead capture, return visits, email list growth

### Content Series with Email Drip
Structure cornerstone content as 3-5 part series. Gate parts 2+ behind email. Each drip drives a return visit.
- **Impact:** Email list growth, return visits, Google quality signal

---

## P2 — Information Architecture

### Add `homeowners-insurance` vertical to taxonomy — DONE 2026-06-09
- [x] New `VERTICALS` entry (tier 1, order 8, 🏡, benchmarkDefaults consistent with the other personal lines).
- [x] Provider audit done via live-site verification (not guessed): added `homeowners-insurance` to the **6** providers confirmed to sell it — Aged Lead Store, iLeads, DataToLeads, Aged Leads Depot, QuoteWizard, SmartFinancial. The Leads Warehouse, Badass Insurance Leads, and Brokers Data verified as NOT selling it (excluded); LeadsData unverifiable (excluded — no assumption).
- [x] `/providers/best/homeowners-insurance` auto-generates (page builds from VERTICALS) with the 6 providers sorted by rating. Price-index handles it like the existing data-less `long-term-care` vertical (overview card shows "Benchmark data coming soon"; `getDecayProfile` falls back to DEFAULT_PROFILE — verified `long-term-care` renders 200 live, same path).
- Note: this is a **vertical** (provider categorization), distinct from the 9 `/lead-types/*` content pages. A dedicated `/lead-types/homeowners-insurance` depth page is a separate, optional follow-up.
- **Impact:** Completeness of provider directory; a major insurance category was previously uncounted.

### Cross-provider vertical audit — automated pass attempted 2026-06-09, NOT applied
An automated live-site audit of the other 14 providers was run but found **too unreliable to apply**: it produced false removals from failed/encoding-broken scrapes (e.g., DataToLeads → "remove 9 verticals" when the page simply didn't render; we'd separately verified DataToLeads sells homeowners) and false additions from weak keyword/imagery inference (e.g., SmartFinancial "+solar/+mortgage/+legal" inferred from a stock image and the sentence "mortgage lenders require homeowners insurance"; QuoteWizard "+mortgage" from a licensing footer). Curated `lastVerified`-dated data was left untouched — per no-fabrication, not overwritten with low-quality scrape inferences. **Needs deliberate per-provider human verification** (the homeowners-insurance add was done that way and is trustworthy). The only concretely-evidenced automated finding worth a manual re-check: Aged Leads Depot may also sell medicare + health (explicit `/aged-medicare-leads`, `/aged-health-insurance-leads` pages).

### Additional Lead Magnets
Only 1 active lead magnet (prospecting checklist). Playbook says 1-2 per site minimum:
- ROI analysis template (PDF)
- Aged lead scripts bundle
- Vertical-specific buying guides
- See [project_als_lead_magnets.md] for planned items

---

## Done — data-led internal linking (2026-06-09)

### Internal-linking pass (driven by GSC/GA4 analysis) — DONE 2026-06-09
Analyzed the GSC export (3 mo: 8,551 impr, 44 clicks, avg pos ~28) + GA4. Finding: high-demand commercial pages (`/lead-types/*`, `/providers/best/*`) rank deep (pos 30–58) while the best-ranking page type (provider profiles, pos ~11) didn't link to them. Built a bidirectional internal-link cluster per vertical: **lead-type guide ↔ price index ↔ best providers ↔ provider profile.**
- [x] `data/lead-type-vertical-map.ts` — single curated source of truth for the lead-type ↔ vertical relationship (both directions hand-curated to avoid mislinks). **Bug fixed:** `home-services-leads` had no mapping → fell back to `home-services` (not a real vertical) → broken `/price-index/home-services` + `/providers/best/home-services` links on that page. Now correctly → `home-improvement` (verified live).
- [x] `components/related-links.tsx` — reusable crawlable cross-link grid (SSR, deduped).
- [x] Provider profiles → link to lead-type guides + best-in-vertical for the verticals they serve (funnels equity from the best-ranking pages to the deep-ranking high-demand pages).
- [x] `providers/best/[vertical]` + `price-index/[vertical]` → link to their sibling cluster pages + the stats page. Also fixed a stray "Updated monthly" → "Verified quarterly" on providers/best.
- **Bottleneck noted:** rankings are page 2–6 because the site is young/low-authority; the biggest remaining lever (backlinks) is Bill's offline track. AI-assistant traffic is real (ChatGPT = 3rd-biggest source in GA4), which the data-study assets feed.

## P2 — Technical & Accuracy

<!-- added 2026-06-08 /brsg-session -->

### Product / Review schema on provider pages — DONE 2026-06-09
~~15 provider review pages lack Product + Review JSON-LD — missing rich-result eligibility (stars in SERP).~~ The pages emitted `Organization` + `AggregateRating` (ratingCount: 1), which Google does NOT grant review-star snippets for (and a single-count aggregate is an anti-pattern). Replaced with a proper **`Product` reviewed by Aged Lead Sales** carrying our editorial star rating (`Review` + `reviewRating`, bestRating 10) — legitimate third-party (non-self-serving) review schema, the structure eligible for star rich results. Identity `Organization` node retained without the rating. The 1 provider with a canonical blog review (`aged-lead-store` → `aged-lead-store-review-2026`) had its rating schema dropped on the profile but the article never actually emitted Review schema — fixed by attaching the Product/Review to the blog article via `reviewArticleSlug` lookup, so all 15 providers now have star schema on their canonical URL.
- **Impact:** SERP CTR via rich results.

### Provider-count overclaims — DONE 2026-06-09
- [x] Homepage/site root meta+OG description said "Compare **50+** lead providers" — this lived in code (`app/(site)/layout.tsx:31`, NOT Sanity; the dataset has no siteSettings/homepage doc type) → changed to "15+".
- [x] `/price-index` "Our team researches **50+** lead providers monthly" → reframed to "researches the aged-lead provider market monthly" (removed the unverified count rather than swapping a new number, to avoid any overclaim).
- **Impact:** Credibility / no-overclaim.

### Price index repositioned as a quarterly verified study — DONE 2026-06-09
Bill's call after the data-integrity dig below: the Lead Price Index is now framed as a **quarterly human-verified study**, not a live monthly AI-estimated feed — matches what the data supports and makes it a stronger citable/link asset.
- [x] All "monthly" / "Updated <Month>" copy → "quarterly verified" / "Verified Q# YYYY" (new `quarterLabel()` helper, derived from latest reliable month) across `/price-index`, `/price-index/[vertical]`, `/methodology`, statistics page. Dataset JSON-LD + meta + citations updated.
- [x] Methodology now states benchmarks are human-reviewed, never auto-generated; AI only flags changes for verification between cycles.
- [x] **Removed the AI-estimate dependency at the source:** marketwatch cron no longer synthesizes/publishes benchmark estimates — it now only monitors provider sites for pricing changes, flags "pricing signals to verify" for a human, stamps lastVerified, and emails the team. Benchmarks remain human-curated; display-side trustworthy gate stays as a backstop.
- **Maintenance:** each quarter, a human verifies pricing and updates benchmark data (Sanity or `data/price-benchmarks.ts`); the "Verified Q#" stamp advances automatically from the latest reliable month.

### Price-index data integrity — single-provider cron junk — DONE 2026-06-09
The marketwatch cron (`app/api/cron/marketwatch` → `lib/cron/marketwatch-ai.ts`) **LLM-synthesizes** monthly benchmarks from scraped provider sites and was publishing single-provider, low-confidence estimates that collapsed to meaningless flat ranges (auto-insurance aged rendered a literal **"$1 – $1"**; mca real-time produced a $150–$2,500 / median $1,325 one-provider guess). Because the index read only the latest month with no quality bar, that junk overwrote the real multi-provider March/April data in the public cards and produced fake "trends" driven by sampling noise.
- [x] `isTrustworthyBenchmark` (≥2 providers sampled) in `data/price-benchmarks.ts`. Single-provider rows stay in Sanity but never surface as headline pricing or trend points.
- [x] `/price-index` now pulls every tracked month (`recentStaticShapedBenchmarksQuery`) and shows each vertical's latest *reliable* benchmark (auto aged now reads the real **$0.25 – $0.50**); freshness date = latest reliable month.
- [x] `/price-index/[vertical]` filters to reliable benchmarks before the gap-fill model, tables, "last updated", and trend chart consume them. Trend chart now renders only where 3+ multi-provider months exist (**mca only** — flat $0.03 data-list, legit); auto/life noise lines correctly suppressed.
- [x] Publish-side guard in `lib/cron/marketwatch-publish.ts` drops sub-2-provider estimates at the source so the junk never gets written again.
- **NOTE / open:** existing single-provider rows (2026-05/06) remain in Sanity, filtered from display. The deeper question — whether an LLM-estimated "monthly index" is the right product vs. a periodic human-verified benchmark study — is a positioning call for Bill. **Impact:** Credibility, no-fabrication, honest trends (#1 traffic/CTR asset).

### Empty pricing comparison table on statistics page — DONE 2026-06-09
- [x] `getPricingDistributionStats` (`lib/statistics.ts`) filtered aged benchmarks on `"31-85 days"` (space) vs the data's `"31-85-days"` (hyphens) → aged column always empty → the flagship **"Real-Time vs. Aged Leads by Vertical"** table on `/blog/aged-lead-industry-statistics` rendered **zero rows**. Fixed; table now populates all 10 verticals (real-time, aged, savings %). **Impact:** flagship statistics page (key linkable/SEO asset) was silently broken.

### Stat-card value overflow — DONE 2026-06-09
- [x] `CopyableStatCard` long values ("$225-$5,000") overflowed the card at the `lg` 4-column layout (`text-3xl`). Held at `text-2xl` + `tabular-nums` + `break-words` so the value stays on one clean line. **Impact:** visible UI breakage on the statistics page.

### Featured images on 2 recent posts — DONE 2026-06-09
Two posts lacked `mainImage` (`life-insurance-aged-lead-roi`, `smart-agents-buy-aged-leads-instead-facebook-ads`) — now 71/71 posts have one. Generated via the existing `scripts/generate-featured-images.mjs` (Unsplash photo, scored for real people in a professional setting, + brand-blue gradient/title overlay → uploaded to Sanity → patched `mainImage`), keeping them visually consistent with the other 69. Sanity-only change; blog renders on-demand so it went live with no redeploy. Verified: hero `<img>` + og:image + twitter:image on both.

### Migrate in-repo crons to central automation
6 crons still live in `app/api/cron/*` (seo-audit, marketwatch, daily-performance, health-check, weekly-content, weekly-newsletter). Per brsg-website-automation, crons are migrating OUT of site repos to the central system. Remove once the central system covers this site.
- **Impact:** Tech-debt / single-source automation.

### Clean up 27 orphaned `seo-draft` PRs (#3–#36) <!-- added 2026-07-03 /brsg-session -->
27 open draft PRs on `seo-draft/*` branches (#3–#36) left by an earlier content-automation routine that opened a PR per draft but never merged/closed them. They clutter the PR list and obscure real review items (this session's PR #40 was buried among them). **Action:** triage — a draft still worth publishing gets folded into the editorial pipeline; the rest get closed + branches deleted. Likely bulk-closable (`gh pr close` + `git push --delete`) after a quick scan confirms none carry unshipped content Bill wants. *Effort: S.*
- **Impact:** Repo hygiene; unblocks legible PR review.
- [x] **DONE 2026-07-21 /brsg-session.** All 27 closed; **0 open PRs** remain. Branches left in place so nothing is lost. Confirmed superseded: 20 targeted "aged life insurance leads" and 7 targeted "aged final expense leads" — the routine re-picked the same two keywords for three months, and each PR wrote to a *different* directory convention (`content/drafts-<date>/`, `content/drafts/<date>-<slug>.md`, `content/drafts/<slug>/draft.md`) so they never collided. Both topics already covered by published posts. **#3 was the exception** — it also carried `lib/cron/model-config.ts`, and that idea was right: see the new P1 note below.

---

## P1 — Reliability (added 2026-07-21 /brsg-session)

- [x] **Dead Anthropic model IDs in four cron modules — FIXED (`8100c18`).** `claude-sonnet-4-20250514` retired 2026-06-15 and started 404ing every run. `marketwatch-ai.ts` was fixed at the time; `ai-content.ts` (×2), `newsletter-ai.ts`, `seo-audit.ts` (×2) and `performance-ai.ts` were missed and still pointed at the dead ID **over a month later**. Nothing was failing in production only because none of those four routes (`weekly-content`, `weekly-newsletter`, `seo-audit`, `daily-performance`) are scheduled in `vercel.json` — re-enable any one and it 404s. `lib/cron/model-config.ts` is now the single source of truth with env-var overrides. Salvaged from abandoned PR #3.
- [x] **The weekly-content routine still has no dedupe gate.** Root cause of the 27-PR pile-up: it re-picked "aged life insurance leads" 20 times and "aged final expense leads" 7 times across three months without noticing. The route is currently unscheduled so this is latent, **but do not re-enable `weekly-content` until a dedupe gate exists** — check both published Sanity slugs *and* open PR titles before drafting. Also collapse the three competing `content/drafts*` path conventions into one. *Effort: M.* <!-- added 2026-07-21 /brsg-session --> RESOLVED 2026-11-14 (this PR): `lib/cron/content-dedupe.ts` runs in `weekly-content` after planning and **before any article is written**. It rejects a brief whose slug is taken, whose primary keyword is already covered by a published post's title/slug or by an open PR title, whose title is close (Jaccard ≥ 0.6) to a post or open PR, or which repeats a keyword within the batch. Open PRs are read from the GitHub API and the gate **fails closed** — if they cannot be read, nothing is drafted. Rejections land in the weekly report as skipped. Tests reproduce the original failure ("aged life insurance leads" is rejected). Drafts convention fixed to the one on main, `content/drafts-YYYY-MM-DD/NN-<slug>/draft.md`; the two others existed only on the closed PR branches. The route stays unscheduled and owner-disabled (`CRON_PUBLISH_DISABLED`).

---

## P3 — Future Growth

### Multi-Step Lead Qualification Quiz
Survey-style funnel: lead type, volume, experience, budget, email. Outputs personalized provider recommendation. Deferred until traffic supports monetization (10K+ uniques/month).
- **Impact:** Primary conversion mechanism, lead capture, qualification data

### Programmatic Geo Pages
`/lead-types/[type]/[state]` style pages adding hundreds of rankable pages.
- Only with real local data (state regulations, market pricing, local providers)
- Minimum 3 unique data dimensions per page

### Original Data Visualizations
- [x] **Price trend charts on price-index pages — DONE 2026-06-09.** Zero-dependency, server-rendered SVG (`components/price-trend-chart.tsx`, crawlable, no client JS). Plots the median aged-lead price + low/high range band across tracked months, picking the best-covered single aged series per vertical (no mixed denominators), 0-baseline, observed data only (no interpolation/model-fills), and only renders with 3+ real months. Live on auto-insurance, life-insurance, mca-business-loans now; more appear as the marketwatch cron accumulates months. Makes the price-index a more linkable data-study asset.
- [x] **Vertical comparison visualization — DONE 2026-06-09.** `components/vertical-savings-chart.tsx` on `/price-index`: horizontal bars ranking verticals by how much cheaper aged is vs real-time (savings %), each bar labeled with the underlying real-time → aged medians so the % is auditable. Rows computed from the same reliable benchmarks the cards show (chart and cards never disagree). Live: Auto 99% → Legal 82%.
- [x] **Provider rating radar charts — DONE 2026-06-09.** `components/provider-rating-radar.tsx` on `/providers/[slug]`: 6-axis radar (transparency, value, compliance, flexibility, platform, reputation) on a fixed 0-10 scale, shown beside the existing rating bars.
- (Charts are SSR SVG by design — no Recharts/client dep needed; honest by construction with full-range axes + role=img aria-labels.)

### Video Content (YouTube)
60-90 second summary videos for key articles, published to YouTube with `VideoObject` schema on the blog post. Google Discover prioritizes video.

### Web Push Notifications
Prompt only after 2+ page views. Use for genuinely valuable triggers (new tool, major data update). 5-15% opt-in when timed correctly.

### Embeddable Charts/Infographics
Beyond calculator embeds — create embeddable data visualizations with attribution links for price benchmarks and market data.

### Digital PR / Source of Sources Profile
Set up profiles on Source of Sources, Featured.com, QWOTED for expert quote opportunities and editorial backlinks.

### Cross-Platform Distribution
- Share every article on X with a strong hook
- LinkedIn carousels repurposing article data
- Repurpose calculator results into shareable social content

---

## Editorial / Content — from the Aged Leads Insights email-program audit (2026-06-13)

Audited the email program (welcome + AI + replenishment series) against the live site. The editorial calendar is already deep, so only the **genuine gaps** were added as `status: "brief"` items in `data/editorial-calendar.ts` (weeks 13–14) — ready for a writing session:

- [x] *(All five below were written and published 2026-06-13 — see the Done section. Ticked 2026-09-15 after confirming two of them live; they had stayed open here.)*
- [x] **Call Recording Consent by State** (Compliance) — the consent-law map + universal-safe disclosure; pairs with the email's record-every-call lesson (existing call-recording-analysis post is about *analysis*, not consent).
- [x] **The Aged-Lead Sales Stack <$100/mo** (Metrics) — software recommender (Workspace + dialer + CRM + drip + recording + scheduling); `/providers` covers lead sellers, not tools. **Affiliate-monetizable.**
- [x] **Put Your CRM on Autopilot: AI Agents + MCP** (Metrics) — the 2026 auto-documentation angle the existing crm-setup/ai-lead-scoring posts predate.
- [x] **Scheduling Links That Book + Capture Consent** (Channel Tactics) — booking links as a consent-capture mechanism.
- [x] **AI Guardrails for Aged-Lead Agents** (Compliance) — the responsible-AI companion to the prompts content.
- [ ] **FLAG — revise existing Week-9 brief** `aged-lead-text-sms-strategies`: it leans pro-SMS, which **conflicts** with the program's stance (don't text non-consent purchased data; earn consent first). Re-angle it around earning consent, or retire it. **Bill's call.**
- Full reasoning: `~/Documents/agedleadstore/agedleadsales-integration-audit.html`.

## Notes

- Audit reference: `_shared-docs/lead-gen-patterns.md` (Sections 1-18)
- Monetization: No display ads or premium features until 10K uniques/month
- Content cadence: 3 articles/week via automated cron, staggered publication dates
- All cron jobs run on Vercel, never locally
