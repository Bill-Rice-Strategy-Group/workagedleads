# workagedleads.com — Work Plan

**Written:** 2026-08-28  **Tier:** 1  **State:** active — post-migration, one operating loop, no human commit in 10 days
**KPI:** monthly outbound clicks from workagedleads.com to agedleadstore.com
**Last data:** 69 affiliate outbound clicks / last 30d (2.3/day), 130 total outbound clicks, 47% leakage to non-monetized partner hosts — `GET /api/reports/outbound-clicks` via GA4 property 528489903, read 2026-08-18T20:19:31Z and recorded in `data/loop/ledger.json`
**Next review:** 2026-09-04 (Tier 1 = weekly, per `../_portfolio/BACKLOG-STANDARD.md`)
**Standard:** ../_portfolio/AEO-SEO-STANDARD-2026.md

> **Repo note.** This file is written against `origin/main`. The local checkout is 28 commits
> behind and does not contain `CLICK-LOOP.md`, `data/loop/`, or any GSC snapshot after
> 2026-08-12. Pull before acting on anything here.

---

## What this site is

An independent review-and-pricing property for the aged-lead market that earns by referring
buyers to **AgedLeadStore.com**. It sells nothing itself. The paid event is an outbound click
to the partner; everything else — sessions, impressions, rankings, email opens — is an input.

As of **2026-08-03** it is one property serving one domain. `agedleadsales.com` and
`howtoworkleads.com` were both 301'd onto **workagedleads.com**; the redirect map is
`data/migration/url-map.csv` (446 rows: 264 REHOST, 82 MIGRATE, 30 MERGE, 29 FOLD, 40 PRUNE).
The repo directory is still named `agedleadsales.com` and the `howtoworkleads.com` repo still
describes itself as a live independent site. Neither fact reflects reality.

The asset inventory, from `origin/main`:

| Surface | Count | Notes |
|---|---:|---|
| Provider profiles | 15 | `data/providers.ts`; 1 monetized (Aged Lead Store), 14 not |
| Lead-type hubs | 13 | `data/lead-types.ts`; each carries 3–7 deep-dive H2s and 6–11 FAQs |
| Price-index verticals | 11 | 106 benchmark docs in Sanity, 81 clear the 2-provider trust gate |
| "Best providers" pages | 12 | `/providers/best/{vertical}` |
| Comparison pages | 17 | 14 head-to-heads vs Aged Lead Store, 3 concept comparisons |
| Calculators | 5 | plus an unused embed route at `/(embed)/calculators/[name]/embed` |
| Blog posts | ~154 published | ~76 native + ~68 imported from howtoworkleads |
| Glossary terms | ~78 | |
| Newsletter | 2,464 subscribers | broadcast `a830c99a`, sent 2026-08-12 |

---

## Where it actually stands

**Every number below carries its source and its measurement date. Nothing is estimated.**

### Search — the old domain still holds the equity, the new one is being discovered

Source: `data/gsc-trend.json` on `origin/main`, `lastUpdated` 2026-08-27T12:03:01Z. Rolling-7d.

| Date | `agedleadsales.com` | | | `workagedleads.com` | | |
|---|---:|---:|---:|---:|---:|---:|
| | clicks | impr | pos | clicks | impr | pos |
| 2026-08-03 (cutover) | 37 | 4,461 | 23.07 | — | — | — |
| 2026-08-14 (new property turns on) | 36 | 6,025 | 20.74 | 0 | 1 | 6.0 |
| 2026-08-18 | 27 | 5,841 | 20.06 | 0 | 45 | 63.84 |
| 2026-08-22 | 35 | 5,308 | 18.45 | 0 | 141 | 61.87 |
| 2026-08-26 | 38 | 4,781 | 18.80 | 0 | 276 | 65.33 |
| **2026-08-27** | **26** | **4,017** | **19.42** | **0** | **262** | **65.31** |

Two things this table says that the portfolio plan does not:

1. **The old domain is not collapsing.** Clicks have oscillated 18–40/7d since cutover with no
   trend break, and **average position has improved from 23.07 to ~19** across the same window.
   Google is still serving the old URLs and they are ranking slightly better than before.
2. **The new domain is being discovered on a normal curve.** Impressions went 1 → 45 → 141 →
   276 in twelve days. Zero clicks at **average position 65** is not a symptom — it is
   arithmetic. Nothing ranks on page one yet, so nothing gets clicked yet.

### Revenue proxy — this is where the real damage is

Source: `data/loop/ledger.json`, baseline captured 2026-08-18, GA4 property **357329146**
(the partner-side commission scoreboard).

| Window | Affiliate sessions/day into agedleadstore.com |
|---|---:|
| 2026-07-04 → 2026-08-02 (pre-cutover) | 14.1 (16.5 including a 73-session spike on 07-07) |
| 2026-08-04 → 2026-08-17 (post-cutover) | **5.4** |

That is roughly a **62% cut**, independently reproduced by the figure in the email plan. It is
the only measured business consequence of the migration and it has not been re-measured since
**2026-08-18 — ten days ago.**

### The on-site scoreboard — one page carries the site

Source: `data/loop/ledger.json` → `scoreboardReadings[0]`, read 2026-08-18T20:19:31Z, last-30d
window, GA4 property 528489903.

| Path | Outbound clicks to ALS | Views | Click rate |
|---|---:|---:|---:|
| `/providers/aged-lead-store` | 39 | 90 | **43.33%** |
| `/start-here` | 4 | 98 | 4.08% |
| `/blog/aged-lead-store-review-2026` | 2 | 20 | 10.0% |
| `/lead-types/mortgage-leads` | 2 | 150 | 1.33% |
| `/lead-types` | 2 | 159 | 1.26% |
| `/lead-types/insurance-leads` | 1 | 161 | 0.62% |
| `/lead-types/final-expense-leads` | 1 | 159 | 0.63% |

**One page produces 57% of the site's affiliate clicks off 90 views.** The four highest-traffic
lead-type pages carry 629 views between them and produce 6. And **61 of 130 outbound clicks
(47%) leave to non-monetized partner hosts** — datatoleads.com (10), leadsdata.com (10),
smartfinancial.com (7), ileads.com (6). Those links are what make the reviews independent and
should not be pruned, but 47% is a large number to be unaware of.

### The volume finding that should govern everything

**76 published posts produced 34 clicks across the whole domain in 80 days** — 6,744
impressions, 0.5% CTR, avg position ~27 (`data/gsc-baseline-2026-06-05.json`, window
2026-03-14 → 2026-06-01). This is the cleanest measured result in the entire BRSG portfolio and
it is the reason `CLICK-LOOP.md` exists.

### The flagship data asset

`priceBenchmark` documents in Sanity: 106 total, 81 clearing the two-provider trust gate,
latest reliable month **2026-06** (`data/loop/price-index-q3-gap.md`, generated by
`npm run price-index:gap`). A price page charts one aged series and needs three trust-passing
months in it; **only `mca-business-loans` has a chart, seven verticals sit at two months and
three at one** (re-counted 2026-11-17 — an earlier "nine at two" came from a gap-script
counting error, see BACKLOG.md). The
`checkMarketwatch` health check ("Lead Price Index study") goes red around **2026-09-09**.

### What is not measured

- Affiliate sessions since 2026-08-18. **Not measured.**
- Outbound clicks since 2026-08-18. **Not measured** — the scoreboard has one reading.
- `sc-domain:workagedleads.com` returns **403** to the GSC MCP identity; GA4 **528489903**
  returns 403 to the GA4 service account. The daily trend cron is the only instrument.
- `howtoworkleads.com` is not in `GSC_PROPERTIES` at all. The third domain's drain is invisible.
- AI citation share, AI referral sessions: **not measured anywhere.** No Bing Webmaster Tools
  registration, no GA4 source-only channel group.

---

## The thesis

**Invest — but the investment is one quarter of research and one weekly habit, not a content program.**

This property has something none of the other eight BRSG sites has: a measured, repeatable
conversion mechanism. `/providers/aged-lead-store` turns 43% of its views into paid clicks.
That is not a ranking achievement, it is an intent match — people searching a merchant's name
are pre-sold, and the page's only job is to be honest and get out of the way. The demand for
that page type is small, cheap to serve, and almost entirely independent of domain authority,
which matters because this domain has none and, per `AEO-SEO-STANDARD-2026.md` §4, is pointed
into the strongest headwind in search: an aggregator/comparison property at DR 0–25 in a market
where 65.3% of ChatGPT-cited pages are DR 81+.

The honest counterweight is that the business is one partner, one traffic source, and a domain
that just gave up two-thirds of its referral volume in a self-inflicted migration. The
migration will complete — the redirects are mechanically correct and the new property is
being discovered on a normal curve — but nobody should plan around it completing this quarter.

So the case for investment is not "grow the site." It is: **the two assets that convert
(merchant-intent pages, the Price Index) are underbuilt, and the asset that does not convert
(the 154-post blog) is finished.** Concentrating on the first two while the migration resolves
in the background is a defensible use of a few hours a week. Publishing post #155 is not.

The case against is real too, and it is in `AEO-SEO-STANDARD-2026.md` §7: if ChatGPT starts
transacting directly, the affiliate click is disintermediated and this entire model goes to
zero regardless of execution. That risk is unquantified. It argues for taking the money now
rather than building a five-year asset.

---

## Now — the next three actions

### 1. Take the 2-week reading on Click Loop iterations 1 and 2 — due 2026-09-01

**Expected effect:** the loop's own kill rule (`CLICK-LOOP.md` step 6) becomes operable for the
first time. Iterations 1 and 2 shipped 2026-08-18 with `measured.at2w: null` and
`verdict: "pending"`. Iteration 2 carries an explicit, falsifiable hypothesis — 629 views/mo on
the top four lead-type pages converting at 0.95%, modelled at 5% for ~31 clicks/mo against a
6-click base. **That is the first real forecast this site has ever made.** Reading it is how
the scoring rule in step 2 gets calibrated. If the hero affiliate door moved lead-type click
rate materially, it generalises to every commercial template on the site. If it did not, the
whole "add CTAs" family of ideas is dead and that is worth knowing cheaply.
**Owner:** Claude (scoreboard read + ledger append is `auto` per the autonomy table). Bill
confirms any kill.

### 2. Publish the Q3 Lead Price Index study

**Expected effect:** turns on `PriceTrendChart` across **seven** price-index pages simultaneously
— `debt-settlement`, `final-expense`, `home-improvement`, `legal`, `medicare`, `mortgage`,
`solar`. Each is exactly one verified month short in its target aged cell; `auto-insurance`,
`health-insurance` and `life-insurance` need two (corrected 2026-11-17 from "nine" — see
BACKLOG.md). Price-index
pages already convert at 8.33–12.50% (life-insurance, medicare, auto-insurance) on 8–24 views;
they are high-C, zero-D pages, and the missing chart is the differentiator that would make them
worth linking to and citing. It is also the only asset on this property that no competitor
publishes, which per `AEO-SEO-STANDARD-2026.md` §3.2 is the one content class that reliably
earns third-party mentions — and per §4, original primary research is the one thing the March
2026 core update rewarded.
**This is human research, not code.** `data/loop/price-index-q3-gap.md` scopes it to specific
cells per vertical so it is a checklist rather than an open dig. Do not let a script synthesize
it — that is exactly the junk removed in 2026-06.
**Owner:** Bill (research), Claude (publish + verify the gate).

### 3. Build the second merchant-intent page

**Expected effect:** the highest measured `C` on the site is `/providers/aged-lead-store` at
43.33%. There are **13 unbuilt `aged-lead-store-vs-{competitor}` comparisons** (one exists:
`vs-badass-insurance-leads`) against 14 partner hosts already in `data/partner-hosts.ts`, and
`/providers/the-leads-warehouse` earned 2 clicks at **position 5.73** on the query "the leads
warehouse reviews" (GSC, 2026-08-27) — competitor-brand queries are landing already. This is
the lowest-authority-dependency traffic available to this domain.
**Caveat that must be respected:** the ledger records comparison pages drawing ~2 views each
despite being indexed. Build **one**, wire it, and measure it at +2 weeks before building
twelve more. Pick the competitor with the most GSC impressions, not the most interesting one.
**Owner:** Claude drafts, Bill approves publish (`hold`, per the autonomy table).

**What is deliberately not in this list:** any new blog post; expanding the `/compare/*`
cluster beyond one test page; the `debt-settlement` and `mca-business-loans` lead-type hubs
(real gaps, but they are Engine-B demand with no measured conversion behind them yet).

---

## Blocked on Bill

| Item | Time | What it unblocks |
|---|---|---|
| **Upload `data/backlink-audit/disavow.txt` (291 domains) and `disavow-workagedleads.txt` in GSC.** The file has been ready and un-uploaded since 2026-07-21 and has now gone stale twice. | ~10 min | The link-defense work already done. Note per `AEO-SEO-STANDARD-2026.md` §2.2 this is *defense*, not growth — do it and stop thinking about links. |
| **Confirm `sc-domain:workagedleads.com` has the sitemap submitted** (`https://workagedleads.com/sitemap.xml`, 330 URLs) and that the property is verified in the same Google account that owns `howtoworkleads.com`. | ~15 min | The only remaining lever on migration speed now that Change of Address errors out. Also settles whether the "URL-level problem" hypothesis has anything in it — see Open Questions. |
| **Grant the GSC MCP identity read on `sc-domain:workagedleads.com` and the GA4 service account read on property 528489903.** Both currently 403. | ~10 min | Every measurement in this plan currently depends on one daily cron. This is the same long-standing "GA4 service-account access to the six BRSG properties" loop. |
| **Register `workagedleads.com` in Bing Webmaster Tools** → AI Performance → Citation Share. | ~10 min | The only AI-visibility measurement available to this portfolio (`AEO-SEO-STANDARD-2026.md` §5), and free. Currently there is no AI measurement of any kind on this site. |
| **Approve the Sanity metaTitle/metaDescription write** — 17 posts with literal `…` in live metadata, including `aged-lead-store-review-2026` (the site's best-converting blog page). Rewrites drafted, dry-run clean, rollback snapshot saved. | ~5 min | Blocked since 2026-07-21 on a permission gate. |
| **Decide whether the weekly Click Loop cadence is real.** Iterations 0–2 shipped 2026-08-18; iteration 3 was due ~2026-08-25 and did not happen. | 1 decision | See the correction below — this, not "go on Iteration 0," is the actual open decision. |

---

## The 90 days

### Days 0–30 (through 2026-09-27)

1. Clear the Bill-only queue above — roughly **50 minutes** total, and it gates every
   measurement in this document.
2. **2026-09-01:** at2w readings on iterations 1 and 2; log verdicts.
3. **By 2026-09-09:** Q3 Price Index published, or the health check is honestly deferred with a
   date. Do not silence the check.
4. Ship one merchant-intent comparison page; measure at +2 weeks.
5. Re-measure affiliate sessions/day against the 5.4 baseline. This number has been stale for
   ten days on the portfolio's only revenue-bearing property.
6. Close the invalidated backlog items (section below) — ~20 minutes.
7. Adopt the `BACKLOG-STANDARD.md` status block. This site's `Now` list is the three actions above.

### Days 30–60 (through 2026-10-27)

8. Run the loop weekly. One asset per iteration, finished. The monthly engine review on
   ~2026-09-27 reallocates by measured clicks-per-asset — that is the mechanism that stops the
   site drifting back into publishing.
9. If the iteration-2 hero-door hypothesis held, roll the pattern to `/price-index/{vertical}`
   and `/providers/best/{vertical}`. If it did not, log the kill and move to Engine C (the
   calculator embed program, which needs no Google ranking at all).
10. Re-run the migration read: has `workagedleads.com` recorded a first click? Has
    `agedleadsales.com` begun to decay? Both are in the daily trend file; nobody has to guess.
11. Fill the two real content gaps only if Engine A measures well: `/lead-types/debt-settlement-leads`
    and `/lead-types/mca-business-loans-leads`. Both have price-index verticals and provider
    coverage but no hub.

### Days 60–90 (through 2026-11-27)

12. Monthly Price Index release cadence, or a documented decision to keep it quarterly. The
    quarterly version already lapsed once and cost two months.
13. Calculator embed program (Engine C) — the route exists and is unused, and referral traffic
    plus earned mentions is the one growth path in `AEO-SEO-STANDARD-2026.md` §2.2 that
    outranks link building.
14. Decision point on the migration: if `workagedleads.com` is still at zero clicks on
    2026-11-27, the 301 strategy has cost a full quarter of revenue and the question becomes
    whether to un-migrate. Set that date now so it is a decision and not a drift.

---

## Growth milestones

| Date | Milestone | Measured by | Baseline |
|---|---|---|---|
| 2026-09-01 | Iterations 1 & 2 have `at2w` values and a verdict | `data/loop/ledger.json` | both `null`, verdict `pending` (2026-08-18) |
| 2026-09-09 | Q3 Price Index published; trend chart on ≥8 verticals (≥3 trusted months in one aged series) | `npm run price-index:gap` | 1 of 11 verticals charts (re-counted 2026-11-17; the 2026-08-18 baseline of "2 of 11" used the wrong rule) |
| 2026-09-27 | Affiliate outbound clicks ≥ 90 / last 30d | `/api/reports/outbound-clicks` | 69 (2026-08-18) |
| 2026-09-27 | `workagedleads.com` records its **first** non-zero rolling-7d click | `data/gsc-trend.json` | 0 every day since 2026-08-14 |
| 2026-10-27 | Leakage share below 40% of total outbound clicks — by adding the ALS alternative where the benchmark supports it, **not** by removing competitor links | `/api/reports/outbound-clicks` | 47% (61/130, 2026-08-18) |
| 2026-11-27 | Affiliate sessions ≥ 10/day, or the 15/day milestone is formally reset with a reason | GA4 357329146 | 5.4/day (2026-08-04→17) |
| 2026-11-27 | Bing Webmaster Tools AI Citation Share has ≥90 days of history | BWT AI Performance | not registered |

A milestone that is missed and silently rolled forward is worse than no milestone. If one
slips, write down why in the ledger.

---

## Backlog items to close as invalidated

All citations are to `../_portfolio/AEO-SEO-STANDARD-2026.md` §1.

| Backlog item | Why it dies |
|---|---|
| **"AEO hygiene: add `llms.txt` + audit answer-snippet/speakable coverage"** (P1 — SEO & Visibility, added 2026-06-19) | §1.1 — Google states llms.txt "will neither harm nor help"; 97% of published files got zero traffic and AI retrieval bots were 1.1% of requests. §1.3 — `speakable` has no current evidence and this exact item is named in the standard as one to close unfunded. `llms.txt` is already shipped here; leave the file, delete the item. |
| **"Track AEO share-of-voice (Ahrefs Brand Radar)"** (P1) | §5 — Bill no longer has an Ahrefs account. Not a re-prioritisation, an impossibility. Replace with Bing Webmaster Tools → AI Performance → Citation Share (free, and in Blocked-on-Bill above). |
| **The `HowTo` JSON-LD half of "Feature the pipeline calculator more prominently"** (P1) | §1.2 — `HowTo` rich results have been gone since 2023. The placement half of that item is still good and the calculator is still the site's best on-site converter (9 of 16 sessions). Keep the placement, drop the markup. |
| **The `FAQPage` line in `CLICK-LOOP.md` step 4 (WIRE checklist)** | §1.2 — FAQ rich results stopped appearing 2026-05-07; Search Console API support ended August 2026. **Keep writing the Q&A blocks** — §3.2 says the content pattern still earns its place, and every lead-type hub already carries 6–11 of them. Just stop justifying them with schema. Replace the checklist line with: "a real Q&A block answering the page's fan-out sub-questions." `Product`/`Review` and `Dataset` on the same line remain correct. |
| **"Make the disavow a recurring task + detection"** as specified (P1, Reliability) | The spec requires a monthly Ahrefs referring-domains pull. §5 — no Ahrefs account. The `lib/backlink-audit/spam-classifier.ts` naming heuristic is still good and the GSC Links report can feed it at lower resolution. Rewrite the item against GSC, or close it: §2.2 puts backlinks at the bottom of the AI-visibility correlation table (~0.194) while brand mentions sit at 0.66–0.74. This is defense, and the defense is essentially done. |
| **"Brand-entity reinforcement / `Organization` `sameAs`"** (P1) | **Do not close this one** — §1.3 explicitly keeps the entity layer as "genuinely load-bearing," and the canonical Bill-Rice URI work shipped 2026-07-29→31. But it now needs a rewrite for a different reason: the `sameAs` set and `Organization` name almost certainly still say "Aged Lead Sales." Re-point the entity at **Work Aged Leads** on the new domain. That is a real, dated task, not AEO hygiene. |

---

## Corrections to the portfolio plan and to this site's own documents

**1. `CLICK-LOOP.md`'s status line is stale, and the portfolio plan repeats it.**
Both say the Click Loop is "proposed, awaiting Bill's go on Iteration 0," and the portfolio plan
adds that it "has been waiting ten days while the property bleeds." That is not what happened.
`data/loop/ledger.json` and the git log show **Iteration 0 shipped on 2026-08-18** (commit
`86c9aee` — scoreboard, ledger, price-index brief), followed the same day by **Iteration 1**
(`5f7b0eb`, monetizing the statistics page) and **Iteration 2** (`119571e`, hero affiliate door
on the lead-type template). Item 3 of Iteration 0 (restart the newsletter) was found already
done and running.

The real gap is different and more useful: the loop declares a **weekly** cadence, iteration 3
was due around **2026-08-25**, and nothing but automated GSC/email cron commits has landed since
2026-08-18. The open decision is not go/no-go on a completed iteration. It is whether a weekly
build cadence is a commitment Bill can keep — and if it is not, the loop should be rewritten as
fortnightly rather than allowed to lapse silently. Fix the status line in `CLICK-LOOP.md` while
you are in there.

**2. "That is the profile of a URL-level problem, not a patience problem" — the data does not support this.**
The portfolio plan argues that zero clicks at position 65 on a domain inheriting a corpus that
ranks at 19 indicates a URL-level defect. The daily trend file says otherwise. `workagedleads.com`
impressions went **1 → 45 → 108 → 190 → 276** between 2026-08-14 and 2026-08-26, which is
discovery working. Position 65 with a 0% CTR is what a page that ranks on page six looks like;
it needs no other explanation. And the old domain's average position **improved** from 23.07 to
18.45 across the same window, which is the opposite of a site losing its canonical.

The recommended one-hour diagnostic is still worth doing — it is in Blocked-on-Bill above,
because sitemap submission and cross-account verification are genuinely unconfirmed and cost
fifteen minutes. But it should be framed as cheap verification, not as chasing a defect the
evidence does not show. **The measured problem is not the crawl. It is that affiliate sessions
fell 62% and have not been re-measured in ten days.**

**3. The backlog's "expand the `/compare/*` cluster" recommendation is not supported by this site's own data.**
Two P1 items (2026-06-13 and 2026-06-19) recommend expanding `/compare/*` on the grounds that AI
assistants cite comparison content and that the AI-Assistant channel drove 10 of 15 key events.
The channel finding may still hold, but the ledger's own note records comparison pages drawing
**~2 views each despite being indexed**, and there are already 17 of them. Build one and measure
it. Do not fund a wave.

Note also that the AI-Assistant channel number itself is now suspect: per
`AEO-SEO-STANDARD-2026.md` §5, GA4's native AI Assistant channel matches on source *and* medium
and fragments ChatGPT across three channels, and Claude was removed from the list while
Perplexity was never in it. Rebuild it as a source-only channel group before quoting the figure
again.

**4. The `/blog` archive is finished, and the repo should say so.**
76 posts → 34 clicks in 80 days is the fleet's most decisive measurement. The archive gets
maintained, internally linked, and mined for fan-out coverage (see `CONTENT-STRATEGY.md`). It
does not get fed. Several open editorial items from the 2026-06-13 email-program audit — five
new post briefs — should be closed or explicitly reclassified as fan-out gap fills against a
named money page, not as posts.

---

## Open questions I could not resolve

1. **What is the actual affiliate revenue now?** The plan quotes ~$2,918/mo pre-migration; that
   figure is not in this repo with a date or a source, and the only measured proxy (sessions/day)
   is ten days old. Until commission revenue is stated with a source and a date, the ROI of
   every action in this document is unknown. This is the single most important missing number.
2. **Is `sc-domain:workagedleads.com` actually submitting a sitemap?** The backlog lists it as
   unconfirmed. I cannot check — the property returns 403 and this environment has no network.
3. **Which Google account owns `howtoworkleads.com`?** The backlog says it is verified under a
   different account than agedleadsales (the one that also holds myperfectmortgage/kaleidicoventures).
   Until that is confirmed, the second Change of Address cannot even be attempted, and the third
   domain's traffic remains untracked.
4. **What happened to the 40 PRUNEd howtoworkleads URLs?** `url-map.csv` marks them PRUNE with
   empty `new_url`. Do they 404, 410, or redirect to the homepage? Homepage-dumping 40 URLs
   would be a genuine migration defect, and it is the one thing in the "URL-level problem"
   hypothesis that has not been ruled out. Twenty *top* URLs were probed; these forty were not.
5. **Is the Q3 Price Index research physically doable in the time available?** It is scoped to
   ~2 cells per vertical across 11 verticals, each needing 2+ provider observations. That is a
   real day of work, possibly two. If it is not, say so now and cut the vertical count rather
   than letting it slip a third quarter.
6. **`data/als-email-report-trend.json` reports `emailSessions: 0` and `emailKeyEvents: 0`** on
   both 2026-08-16 and 2026-08-23, against audiences of 1,124 and 1,308. Either the email
   program is producing nothing or the measurement is broken. I could not tell which from the
   repo alone.
