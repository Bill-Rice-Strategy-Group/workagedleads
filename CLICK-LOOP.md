# The Click Loop — workagedleads.com growth operating cycle

**Created:** 2026-08-18
**Supersedes:** the consolidation-recovery workstream in `data/migration/MIGRATION-PLAN.md`
(cutover complete 2026-08-03; Change of Address failed through August and was finally filed
successfully 2026-09-01 for both old domains — see "Why we stopped waiting", now partly superseded).
**Status:** proposed, awaiting Bill's go on Iteration 0.

---

## Goal

**Maximize monthly outbound clicks from workagedleads.com to agedleadstore.com.**

That is the paid event. It is the only number this loop optimizes. Traffic, rankings,
impressions, and email opens are inputs — they get measured, but they never get to be
the goal, because none of them pay.

**Scoreboard:** `GET /api/reports/outbound-clicks` (Bearer `CRON_SECRET`), GA4 property
`528489903`, `eventName=click` filtered to `linkDomain=agedleadstore.com`. Already built,
already working. No new instrumentation.

**Baseline to beat:** 5.4 affiliate sessions/day (Aug 4–17), down from 14–16.5/day
pre-cutover. **Recovering to 15/day is the first milestone**, not the ceiling.

---

## Why we stopped waiting on Google

The consolidation is mechanically correct — 20/20 top old URLs single-hop 301 to their
exact mapped counterparts. But Google has not recrawled them (top pages last crawled
2026-07-31, 07-06, 07-02 — all before the Aug 3 cutover), and **Change of Address errors
out**, so the accelerator that exists for precisely this situation is not available to us.

> **Update 2026-09-01 — the accelerator is now in place.** Bill re-filed and both moves passed
> validation; `workagedleads.com` lists `agedleadsales.com` and `howtoworkleads.com` as moving
> sites. The paragraph above stands as the reasoning that was correct at the time, and the loop
> below is deliberately *not* being rewritten around this: CoA prioritizes recrawl, it does not
> deliver clicks on a schedule we control, and a strategy that only works if Google cooperates is
> the one this document was written to replace. Measure on 2026-09-15 (baseline in `BACKLOG.md`);
> until it demonstrably moves the new domain off position 65, plan as if it had not been filed.

The redirects stay in place and the transfer will complete on Google's schedule. We stop
spending effort on it. `sc-domain:workagedleads.com` is already onboarding on its own
(rolling-7d impressions 1 → 2 → 3 → 8 → 45 since Aug 14). That runs in the background.

Everything in this document is designed to produce clicks **without** waiting for that.

---

## What the data says before we plan anything

Three findings reshaped this plan. Each is measured, not assumed.

### 1. The blog engine is not producing clicks

**76 published posts** produced **34 clicks** across the whole domain in 80 days
(`data/gsc-baseline-2026-06-05.json`, 2026-03-14 → 2026-06-01: 34 clicks / 6,744
impressions / 0.5% CTR / avg position ~27).

That is the central strategic fact. Adding post #77 is the lowest-expected-value action
available. **The loop stops feeding the blog as a volume play.**

### 2. The demand that exists is merchant-intent, not informational

Ranked by clicks in the baseline capture, the top queries are:

| query | clicks | intent |
|---|---:|---|
| aged lead store reviews | 3 | **merchant review** |
| aged mortgage leads | 1 | commercial |
| aged leads | 1 | commercial |
| agedleadstore | 1 | **merchant navigational** |
| aged leads store | 1 | **merchant navigational** |
| iul leads | 1 | commercial |

Top clicked pages tell the same story: `/providers/aged-lead-store` (3),
`/providers` (2), `/blog/aged-lead-store-review-2026` (2).

**People are searching for the merchant we get paid to refer, by name.** That is the
highest-intent, lowest-cost, least-authority-dependent traffic on the internet for this
business — and it converts to an outbound click at a far higher rate than any explainer post.

A second cluster is explicitly **price-shopping**: "leads price", "insurance leads cost",
"exclusive life insurance leads price". Which brings us to:

### 3. The flagship data asset died in June

`priceBenchmark` documents in Sanity (project `p7rbtajg`, dataset `production`):

| month | docs |
|---|---:|
| 2026-03 | 42 |
| 2026-04 | 45 |
| 2026-05 | 9 |
| 2026-06 | 10 |
| 2026-07 | **0** |
| 2026-08 | **0** |

The cause is **not** a broken cron. It is a missing human step, and that distinction
matters because it changes the fix entirely:

- **July** was a genuine crash: `marketwatch` called retired model
  `claude-sonnet-4-20250514` → 404 on all 14 providers. Already fixed in
  `lib/cron/model-config.ts` (now `claude-sonnet-5`). One month lost.
- **August is working as designed.** `app/api/cron/marketwatch/route.ts:156` documents a
  deliberate decision: *"The Lead Price Index is a quarterly human-verified study, not an
  LLM-estimated feed."* Auto-synthesis was removed because single-provider LLM guesses
  polluted the public index. The cron's job is now to **monitor and surface** pricing
  signals for a human to verify and publish. `newBenchmarksGenerated = 0` is correct.

That decision was right, and a trigger does exist — `checkMarketwatch` in `health-check`
was re-thresholded to 100 days and renamed "Lead Price Index study", so it goes red around
**2026-09-09**. The study is due, not yet alarming. It is a writing task, not a code one.

What was not visible until now is the size of the prize. A price page draws its trend chart
from **one aged series** — a single `31-85-days` or `86-180-days` cell (one exclusivity + lead
type) — and only once that series has **3 trust-passing months** (`selectTrendSeries` in
`lib/price-trend-series.ts`). Counted that way (2026-11-17):

| trusted months in best aged series | verticals |
|---|---|
| 3 (chart renders) | `mca-business-loans` |
| 2 (**no chart**, one month away) | `debt-settlement`, `final-expense`, `home-improvement`, `legal`, `medicare`, `mortgage`, `solar` |
| 1 (**no chart**, two months away) | `auto-insurance`, `health-insurance`, `life-insurance` |

**Seven of eleven verticals are exactly one verified aged month away from a trend chart.** The
Q3 study is not maintenance — it is the single action that turns on a differentiated visual
across seven price pages at once, aimed squarely at the price-shopping query cluster.

> Correction (2026-11-17): this section originally said *nine* verticals were one month away and
> that `life-insurance` had a chart. That came from `npm run price-index:gap` counting months
> across any trust-passing cell, real-time included — not the single aged series the page plots.
> Fixed in the gap script; see BACKLOG.md.

The Aged Lead Price Index is the one asset on this site no competitor publishes, and the
natural thing for an LLM to cite. It is one quarter of research away from being twice the
asset it is today.

---

## The Loop

**Cadence:** weekly build iteration. Monthly engine review.

Weekly is the fastest cadence at which the scoreboard can actually move. Anything faster
measures noise.

### Each iteration, six steps

**1. READ the scoreboard.**
Pull `/api/reports/outbound-clicks` for 7d and 28d. Record clicks to agedleadstore.com,
plus clicks leaking to the other 14 hosts in `data/partner-hosts.ts`. Append one row to
`data/loop/ledger.json`.

**2. PICK by expected value, not by interest.**
Score every candidate in the backlog:

```
expected monthly ALS clicks  =  D  ×  P  ×  C

D = monthly search demand for the target cluster   (Ahrefs / GSC)
P = achievable organic CTR at a realistic position for a new page on this domain
C = measured page → agedleadstore.com click rate for that page archetype
```

`C` is where the leverage lives, and it varies by an order of magnitude across
archetypes. Merchant-review and comparison pages convert to outbound clicks at multiples
of what an explainer post does. **Take the top-scoring item. One asset per iteration,
finished, not three started.**

**3. BUILD** from the rotating engine deck below.

**4. WIRE** — non-negotiable checklist, every asset:
- Affiliate CTA in three positions: above fold, mid-body, close. `lib/affiliate.ts`
  only — never a hand-written URL.
- Internal links **in** from at least two existing pages that already earn impressions.
- Schema: `Product`/`Review` for merchant pages, `Dataset` for price-index pages,
  `FAQPage` where a real FAQ exists.
- `/methodology` link wherever a number appears. Credibility is the moat on a review site.

**5. DISTRIBUTE — this is the part that doesn't wait on Google.**
- Email the 2,373 mailable contacts. This is the only lever with same-day effect.
- Calculator embed offered to relevant hosts (`/(embed)/calculators/[name]/embed`
  already exists and is unused).
- Data releases pitched to trade newsletters and communities.

**6. MEASURE and kill.**
Two full iterations after publish, check the asset's own outbound clicks. Under 3
clicks/month → stop investing in that archetype. Log the kill in the ledger. No asset
class survives on narrative.

### Monthly engine review

Reallocate the next four iterations across engines by measured clicks-per-asset. The
engine with the best clicks-per-hour gets more slots. This is what keeps the loop from
degenerating back into "publish more posts."

---

## The four engines

Rotation exists so we don't over-index on whichever one is easiest to write.

### Engine A — Merchant intelligence *(start here)*

Review, comparison, and "best" pages targeting merchant and competitor brand queries.
Highest intent, lowest word count, least dependent on domain authority, highest `C`.

Seeded from actual demand and the 15 hosts already in `data/partner-hosts.ts`:
- Refresh and expand `/providers/aged-lead-store` and `/blog/aged-lead-store-review-2026`
  — these already earn the most clicks on the site with zero recent investment.
- `aged-lead-store-vs-{competitor}` for each of the 14 partner hosts. One exists
  (`vs-badass-insurance-leads`); 13 do not.
- `/providers/best/{vertical}` for verticals not yet covered.
- Capture competitor-brand queries surfacing in GSC ("goat leads life insurance", etc.).

**Editorial guardrail:** ALS is the default recommendation only where the benchmark data
supports it. Independence is the reason these pages rank and convert — the moment they
read as paid placement, both die. Non-monetized providers keep honest coverage.

### Engine B — Live data *(the moat)*

- **Revive the Price Index.** Publish the overdue Q3 study from signals already collected,
  then hold the quarterly cadence with a real scheduler behind it.
- **Monthly Aged Lead Price Index release** — a dated, citable report per month. This is
  the pitchable artifact and the LLM-citation magnet.
- Expand `/blog/aged-lead-industry-statistics` into a maintained statistics hub with
  per-stat anchors.
- Publish coverage honestly: 10 benchmark rows is thin. Grow rows before growing claims.

### Engine C — Tools

Five calculators exist (`know-your-cpl`, `lead-cost-calculator`,
`outreach-cadence-planner`, `pipeline-calculator`, `roi-calculator`) and the embed route
is built and unused.

- Every calculator result screen ends in a specific ALS recommendation — a lead type and
  volume derived from the user's own inputs, not a generic banner.
- Launch the embed program: embeddable widget with attribution link. Referral traffic
  plus earned links, neither of which needs a Google ranking.
- New tools only where a price-shopping query exists that a calculator answers better
  than prose.

### Engine D — Experiences

Interactive, gated where it earns an email, always ending in a personalized ALS
recommendation.

- Lead-buying readiness assessment → scored result → matched lead type → ALS link.
- "Grade my aged-lead operation" diagnostic drawing on the flagship playbook's
  Fresh-Consent Ladder framing.
- Feeds the list, which feeds step 5, which is the fast lane.

---

## Iteration 0 — unblocks (before the loop can run honestly)

Four items. Each is a prerequisite, not an improvement.

| # | Item | Why it blocks the loop |
|---|---|---|
| 1 | **Q3 Lead Price Index study.** Scoped by `npm run price-index:gap` → `data/loop/price-index-q3-gap.md`: which cells to re-price per vertical, and the pricing signals already collected. The study itself is **human research** — the collected signals do not clear the 2-provider trust gate on their own, and synthesizing from them would recreate exactly the junk removed in 2026-06. Publishing one verified month of each vertical's target aged cell unlocks trend charts on 7 verticals (3 more need two months). | Engine B's flagship asset is stale, and 10 of 11 price pages are rendering without their differentiating visual. |
| 2 | **Add `pagePath` to the outbound-clicks report.** One dimension added to an existing GA4 query — read-side only, no tracking changes. | Step 2's `C` term and step 6's kill rule are both unmeasurable without knowing which page sent each click. |
| 3 | ~~**Restart the newsletter.**~~ **Already done and running.** The cron is preview-only and archives to `data/newsletter-archive/`, `scripts/send-newsletter.ts` is the explicit send path with dry-run/seed/confirm and a double-send refusal, `newsletter:migrate` reconciles the audience, and the Sunday cron is back in `vercel.json`. The 2026-08-10 issue shipped 2026-08-12 (broadcast `a830c99a`). | — |
| 4 | **Create `data/loop/ledger.json`** — one row per iteration: date, asset shipped, engine, expected clicks, measured clicks at +2 and +8 weeks, verdict. | Without a ledger the monthly review has no input and the loop drifts. |

Items 1, 2, and 4 are code and I can do them. Item 3 is code plus one Bill approval on
the first send.

---

## Autonomy

Per the `hold` convention in `claude-config/routines/autonomy-register.md`, and consistent
with workagedleads.com being autonomy-2 (draft):

| Step | Mode |
|---|---|
| Scoreboard read, ledger append | **auto** |
| Candidate scoring and ranking | **auto** |
| Asset build | **hold** — drafted, Bill approves |
| Publish to production | **hold** — never auto-publish |
| Newsletter send | **hold** — explicit confirm, per the email plan |
| Kill decisions | **hold** — logged with evidence, Bill confirms |

No auto-publishing. That was removed deliberately in `f759ff6` and this loop does not
reintroduce it.

---

## Flag conditions

Interrupt Bill mid-cycle only for these:

- Outbound clicks to agedleadstore.com fall below 3/day on a 7-day average.
- A quarter closes with no Price Index study published (the lapse that just cost two months).
- Outbound clicks to non-monetized partner hosts exceed clicks to agedleadstore.com.
- A published asset's affiliate CTA resolves to a non-buy page, or UTMs are stripped.

---

## Out of scope

- **Tracking and attribution.** In place and working. Untouched. The one exception is
  Iteration 0 item 2, which changes a report query, not instrumentation.
- **Further Change-of-Address attempts.** ~~Confirmed dead.~~ **Resolved 2026-09-01** — Bill
  re-filed and both passed. `workagedleads.com` now shows `agedleadsales.com` and
  `howtoworkleads.com` as moving sites. Nothing further to push; the open item is measuring it on
  2026-09-15 (baseline in `BACKLOG.md`). Everything below was designed to produce clicks *without*
  this, and that stays true — CoA prioritizes recrawl, it does not deliver traffic on a schedule
  we control.
- **Lifecycle email journeys**, send caps, and the `news.workagedleads.com` sender —
  working, untouched.
- **Blog volume as a growth strategy.** 76 posts, 34 clicks. The archive gets maintained
  and internally linked; it does not get fed.
- **Backlink Batch 3** (1,312 links) — still needs Bill's scope call, unrelated to this loop.
