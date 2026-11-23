# workagedleads.com — Consolidation & Migration Plan

Authored 2026-07-29. Written to the repo 2026-07-31 — before that it existed only
in a chat transcript, which made the project look dormant when it was ~70% built.
Status lines and the two answered decisions are current as of 2026-07-31.

`data/migration/url-map.csv` is the single source of truth for Phases 2c, 5 and 6.
This file is the source of truth for *sequence, gates and rollback*. When the two
disagree about a URL, the CSV wins. When they disagree about an order of
operations, this file wins.

---

## Context

howtoworkleads.com and agedleadsales.com are two BRSG-owned affiliate sites in
the same ~3,000-search/month niche, both stuck on page 2–3, both competing with
each other and with their own affiliate partner (agedleadstore.com ranks #1 for
nearly the entire commercial vocabulary at KD 0–7). Neither domain has authority
worth protecting (DR 2–3, ~0 Ahrefs organic keywords). agedleadsales.com is
additionally one letter-cluster from the vendor it publishes independent reviews
of, which undermines the editorial independence the affiliate model depends on.

**Outcome:** one site on workagedleads.com (owned, registered 2025-12-01,
currently a GoDaddy parking lander), positioned on the review/compare/how-to
layer a vendor structurally cannot occupy, with a single content corpus, one
email list, and the agedleadstore.com link inventory repointed.

**Decisions already made:** fold all 23 `/buying-leads/*` pages into
`/lead-types/*`; staged cutover (soft launch noindexed → verify → flip).

---

## Status at a glance — 2026-08-03

Measured, not remembered. Every line below was checked live today against
workagedleads.com; the previous version of this table was 2026-08-01 and three
of its rows are now wrong in the optimistic direction's favour.

| Phase | State |
|---|---|
| 0 — Pre-flight | D16/D17 answered. Rev-share baseline closed by Bill. **Sanity export unverified** — stored outside the repos, cannot confirm from here |
| 1 — Content decisions | **Done.** 421 rows, zero unresolved |
| 2a — Sanity content import | **Done and live.** The 81 drafts are published — every blog destination that 404'd on 08-01 now returns 200 |
| 2b — Domain reference sweep | **Done and merged** (#59). `lib/site-url.ts` is the single source; `ALLOWED_HOSTS` carries both hosts |
| 2c — Redirects | **Done and merged.** All 52 path-change rules verified correct on the new host |
| 2d — List consolidation | **Applied.** 2,435 distinct / 2,368 sendable on `43fe6675-…` |
| 3 — Soft launch | **Done.** workagedleads.com serves the real site behind `x-robots-tag: noindex, nofollow`, canonicalling to agedleadsales.com |
| 4 — Verification gate | **Map half passes.** 108/108 destinations resolve, 52/52 path rules correct. Lead-capture probe not yet run |
| 5 — Cutover | Not started. Steps 2–3 (GSC properties + service-account grant) done early, 2026-08-03 |
| 6 — Post-cutover | Not started |

### What changed since 2026-08-01, and what the old table got wrong

Three rows were stale in a way that would have caused bad decisions:

- *"Phase 3 not started — workagedleads.com still serves the GoDaddy lander."*
  **Wrong now.** It serves the real site, noindexed. Soft launch is live.
- *"81 posts sit as unpublished drafts, 78 destinations resolve to 404."*
  **Closed.** Probed all 108 distinct redirect destinations from `url-map.csv`
  today: **107 return 200**, and the one non-200 is `/lead-order`, whose 307 to
  `agedleadstore.com/all-lead-types/` carrying `utm_source=agedleadsales` is the
  deliberate D16 behaviour, not a defect.
- *"2b in progress."* Merged.

Verified the same day: all 52 rows whose path changes redirect **301/308 to
exactly the mapped destination** on workagedleads.com. Zero served 200 instead
of redirecting, zero landed anywhere other than the mapped URL.

### What is actually left

Ordered by what blocks what.

1. **The merged disavow does not exist yet.** `data/backlink-audit/disavow.txt`
   is 291 domains, agedleadsales.com only, last refreshed 2026-07-21. There is
   no howtoworkleads.com list folded in. It has to be built AND submitted on the
   **URL-prefix** property `https://workagedleads.com/` — the disavow tool does
   not accept domain properties — **before** the 301s fire, because none of the
   existing protection follows a redirect and both source profiles are ~95% PBN.
   This is the highest-consequence item left.
2. **Two fold destinations are still shells.** `/lead-types/health-insurance-leads`
   renders 363 words and `/lead-types/auto-insurance-leads` 315, against 3,553
   and 3,657 for the two that are done. Both are live redirect destinations.
3. **The lead-capture probe has not been run on the new host.** `ALLOWED_HOSTS`
   does contain workagedleads.com and its www — the single highest-risk line —
   but `isGoodOrigin()` returns `{success: true}` on failure by design, so the
   only proof is a real form POST landing a contact in Resend.
4. ~~**The re-introduction broadcast has not been sent.**~~ **Cancelled
   2026-08-03 by Bill.** No broadcast. Sending simply moves to the new domain
   and a transitional line in the email footer carries the recognition — see
   `lib/rebrand-notice.ts`. `REINTRODUCTION-EMAIL.md` is deleted rather than
   left in the repo describing a staged three-wave send nobody is going to run.
5. **Two ALS opt-outs still live only in Resend**, not in Postgres, so the
   lifecycle cron can still mail them. Was 15 on 08-01; #58 closed all but two.

### Decisions answered since authoring

**D16 — affiliate attribution. Answered 2026-08-01 by Bill:** *"All affiliate
traffic is UTM based, no dependence on URL. Even if it was we can account for
that. No blocker here."*

This closes the Phase 0 gate. The target-domain decision does not reopen, and
the UTM value is a one-line change in `lib/affiliate.ts` at cutover (Phase 5
step 10). It also resolves `/lead-order`: keep it as a **temporary** redirect,
carrying the UTM source from that constant.

**D17 — the four empty fold destinations. Answered 2026-08-01 by Bill:**
*"Harvest and make it better if there are improvements. The goal is to
consolidate and make one better site. Bigger, better and easier to maintain."*

Harvest is authorized for all four, and the bar is improvement over the source,
not transcription of it.

**D20 — the editorial line. Answered 2026-08-01 by Bill: option B.**

**Work Aged Leads is the operator's site. Its subject is working the lead, not
buying it.** Buying content — the price index, the provider directory, the
comparisons — stays, and becomes the on-ramp that brings a buyer in the door.

The question existed because the merge created a contradiction nobody had
resolved. The site's inherited positioning said one thing and its corpus said
another:

```
tagline  The independent lead buying intelligence platform   (buying)
corpus   71 working-side posts vs 28 buying-side             (2.5:1 working)
```

All 157 published posts classified: working the lead 71 (45%), buying it 28
(18%), compliance 13 (8%), other 45 (29%).

Three reasons B rather than A:

1. **It is the layer a vendor structurally cannot occupy** — this plan's own
   stated reason for the project. agedleadstore.com's incentive is to sell more
   leads; it can never credibly say buy fewer and work them harder. A would put
   this site in a fight with agedleadstore.com over a commercial vocabulary it
   already ranks #1 for at KD 0–7.
2. **It inverts the affiliate conflict.** Under A, "marketing director of a lead
   vendor reviews lead vendors" is something `/affiliate-disclosure` has to
   manage. Under B, the same fact is a credential.
3. **The corpus already voted**, 71 to 28.

**What this binds going forward.** Every new page leads with what the reader
does after the lead is in their CRM; price and provider material supports that
rather than fronting it. The vertical pages carry a working-side thesis specific
to their vertical — life insurance is trigger-driven so the record ripens; home
improvement is seasonal so you buy counter-seasonally — and the buying advice
falls out of the thesis rather than the reverse.

---

## Architecture decision: rename in place, do not rebuild

**Reuse the agedleadsales.com repo, Vercel project, and Sanity dataset.** Add
workagedleads.com as the primary domain and import howtoworkleads content into
the existing dataset.

This is load-bearing, not cosmetic:

- `lib/cron/google-auth.ts` authenticates via `getVercelOidcToken()` → Workload
  Identity Federation → service-account impersonation. The WIF pool provider is
  bound to **this Vercel project's OIDC subject**. A new Vercel project silently
  breaks GA4 + GSC for every analytics cron until the GCP binding is
  reconfigured.
- The Sanity dataset holds the full corpus — posts, glossary terms, price
  benchmarks, providers, verticals, lead types. Migrating that to a new dataset
  is pure risk for zero gain.
- All env vars, cron schedules, and the Resend audience already live here.

| Asset | Value |
|---|---|
| Repo | `github.com/billriceusa/agedlead-sales` → rename to `workagedleads` |
| Local | `~/Code/sites/brsg/owned/agedleadsales.com` → rename dir to `workagedleads.com` |
| Vercel | `prj_oUHRfhwQeslv5A0CJOokOsQyJdpH` / `team_yG45Ygh9OOGlDkOR0Y2vkYnK` (keep) |
| Sanity | `p7rbtajg` / `production` (keep) |
| Retired | `github.com/billriceusa/howtoworkleads`, Sanity `e9k38j42` (archive, do not delete) |

howtoworkleads.com is Next.js 14 / React 18 / turbo monorepo; agedleadsales.com
is Next.js 16.1.1 / React 19 / single app. **No code migrates from
howtoworkleads** — only content. Its components have equivalents already built
on the target.

---

## Content inventory (live, 2026-07-29)

| Source | Type | Count | Disposition |
|---|---|---|---|
| HTWL `e9k38j42` | blogPost | 113 | Transform → `post`; merge near-dupes; prune zero-impression |
| HTWL | landingPage `/buying-leads/*` | 23 | Fold into `/lead-types/*` |
| HTWL | landingPage generic (crm-systems 5, lead-management 5, sales-process 6) | 16 | **Prune** — position ~43.8 |
| HTWL | landingPage `/resources/about` | 1 | Merge into existing `/about` |
| HTWL | categoryPage | 9 | Map to 6 existing categories, drop the rest |
| ALSales `p7rbtajg` | post / guide / leadType / leadProvider / glossaryTerm / priceBenchmark / vertical | 76 / 1 / 12 / 15 / 77 / 106 / 15 | Keep as-is |

**Zero exact slug collisions** between the two blog corpora — the merge is
additive.

---

## Phase 0 — Pre-flight (no changes)

1. ~~**Confirm attribution with Troy in writing.**~~ **ANSWERED 2026-08-01 —
   UTM-keyed, not domain-keyed. No longer a gate.** See D16 above.
2. Pull current howtoworkleads rev-share run-rate (the ~$2,918/mo figure is from
   March and unverified). **Still open** — and it is the baseline the Phase 6
   watch measures against, so it must be captured before cutover, not after.
3. Export Sanity datasets: `npx sanity dataset export production` for **both**
   `p7rbtajg` and `e9k38j42`. Store outside the repos. **Still open.** This is
   the content backstop the rollback path depends on.
4. Export **every** source Resend audience. **Still open**, but lower risk than
   it was: the merge only reads the sources and they survive intact as their own
   rollback path.
   - `d579bf1f-0467-45a3-ad6b-52460920a903` — `agedleadsales-newsletter` (219)
   - `8a35228e-149f-4b15-8e24-26a24e3d6e98` — `howtoworkleads-newsletter` (38)
   - `9657093e-99fe-4a34-9846-946be85b64f7` — `ALS Buyers — Purchasers` (1,029)
   - `83613b84-c1fd-4362-9dd1-8914533e30f8` — `ALS Buyers — Inquiries` (1,245)
   - `74476de7-677f-4686-bfb9-d6fe66a5d855` — `ALS Store Self-Serve` (31)

   This item originally named only the first. The unsubscribed flags across all
   five are the part that cannot be reconstructed if lost.

   Destination audience, created 2026-08-01:
   `43fe6675-cc8f-44f3-9c1c-70a094b2d47d` — `workagedleads.com`. Merged and
   deduplicated: **2,435 distinct, ~2,368 sendable, 67 suppressed.** Suppression
   is the union of Resend and Postgres — see below.
5. Finish the in-flight disavow refresh on the `disavow-refresh` worktree; build
   a **merged, de-duplicated disavow** covering both source domains, ready to
   submit in Phase 5.
6. Send Troy Batches 1–2 from `als-backlink-placements.html`. Independent of the
   migration; do it now.

---

## Phase 1 — Content decisions · DONE

One CSV, `data/migration/url-map.csv`, columns:
`old_url, new_url, action, risk, clicks, impr, pos, notes`. Every one of the 421
live URLs (175 HTWL + 246 ALSales) has a row.

| Action | Count | Meaning |
|---|---:|---|
| `REHOST` | 246 | agedleadsales.com page, path unchanged, host swap only |
| `MIGRATE` | 82 | howtoworkleads page moves across at the same path |
| `PRUNE` | 48 | Dropped — generic theory, zero-impression, dead hubs |
| `FOLD` | 27 | `/buying-leads/*` and category hubs into `/lead-types/*` |
| `MERGE` | 18 | Content merged into an existing target page, then 301 |

Zero `REVIEW` rows remain. All 23 distinct `FOLD`/`MERGE` destinations verified
live at HTTP 200 on 2026-07-29.

### Rules that came out of building it — keep these

- **Never prune a CTA or affiliate link-out endpoint.** `/lead-order` was marked
  PRUNE on 25 impressions. It is not a page; it 307s to agedleadstore.com with
  UTM tagging, and a crawl found 36 link instances across 17 pages. A redirect
  endpoint's search metrics measure nothing — nobody searches for it, they click
  it. Before pruning any zero-content URL, check what links to it.
- **Prune eligibility is the intersection of two GSC windows.** On a single
  window, a page that decayed off page 1 reads identically to one that never
  ranked. This rule is what stopped the namesake cornerstone article being
  deleted at position 6.2. When the next export lands, **add** the window — do
  not replace the old one.
- **Position is impression-weighted, never a flat mean.** A page appears in the
  export as several rows (www, non-www, every `#fragment`). Flat-averaging them
  fabricated page-1 rankings and mislabeled risk.
- **Risk leads with clicks, not position.** A page earning 67 clicks at position
  13 deserves more care than one earning 1 click at position 12.
- **Never redirect to the homepage or a generic hub.** Precedent:
  `/playbooks/7-day-aged-lead-follow-up-cadence` ranked ~position 6 and was 301'd
  into a generic `/playbook`, wasting the equity. Topic-matched destination, or
  keep the page.
- **Harvest before redirecting.** Take the source copy into the destination
  *before* the redirect fires. Do not redirect first and backfill later.

### The four high-risk rows

`/buying-leads/*` is 60% of howtoworkleads clicks and 51% of its impressions.

| Position | Clicks | Impressions | Page |
|---|---|---|---|
| 13.3 | 67 | 3,346 | `/buying-leads/buy-iul-leads` |
| 33.6 | 51 | 20,714 | `/buying-leads/buy-life-insurance-leads` |
| 12.4 | 1 | 138 | `/buying-leads/buy-mortgage-protection-leads` |
| 10.7 | 3 | 278 | `/buying-leads/buy-non-qm-mortgage-leads` |

---

## Phase 1b — Fold destinations must be real pages · IN PROGRESS

Added 2026-07-31. This work was implied by the harvest rule but never scoped,
and it is where 39% of the fold's clicks land.

**Where lead-type page content actually lives.** Read
`app/(site)/lead-types/[slug]/page.tsx` before touching any of this:

```tsx
const data = LEAD_TYPES[slug];        // data/lead-types.ts — static TS, ~1,271 lines
if (!leadType && !data) notFound();
{leadType?.body && ( /* CMS body — REPLACES the static sections */ )}
{!leadType?.body && data && ( /* what-are · why-use · cost comparison · script
                                · best practices · deep dive · FAQ */ )}
```

The Sanity `leadType` document supplies hero, icon, `shortDescription`,
`averageCostPerLead` and SEO metadata. The ~2,800 words come from
`data/lead-types.ts`.

**Consequence:** setting `leadType.body` in Sanity looks like a fix and silently
drops the cost-comparison module, the sample-script block, glossary
auto-linking, and the FAQ JSON-LD (which is emitted from `data.faqs`, not from
Sanity). **Build these as `LEAD_TYPES` entries, not CMS bodies.**

Measured 2026-07-31 — rendered word count of the live page:

| Destination | Words | Fold traffic arriving | `LEAD_TYPES` entry? |
|---|---:|---|---|
| `/lead-types/life-insurance-leads` | 313 → **3,417** | 52 clicks · 21,132 impr | **Yes** (PR #48) |
| `/lead-types/home-improvement-leads` | 313 → **3,428** | 9 clicks · 2,647 impr | **Yes** (PR #49) |
| `/lead-types/health-insurance-leads` | 312 | 2 clicks · 1,243 impr | No |
| `/lead-types/auto-insurance-leads` | 310 | 0 clicks · 0 impr | No |
| the other eight | 2,801–3,256 | — | Yes |

**Order of work, by impressions at risk:** `life-insurance-leads` first (87% of
the at-risk impressions), then `home-improvement-leads`, then
`health-insurance-leads`, then `auto-insurance-leads`.

**Word counts above are not all measured the same way.** The 313/310 figures and
the 2,801–3,256 range came from an earlier extraction; the two rebuilt pages were
measured against a production build with nav and footer stripped, which returns
206 for an untouched shell rather than 313. Treat the before/after pairs as
same-method comparisons and the cross-row comparisons as approximate.

**~~`home-services-leads` is an orphan and the cheapest of the four.~~ Done in
PR #49.** The Sanity document was renamed to `home-improvement-leads` in Phase 1;
the `data/lead-types.ts` entry was not, so the deep content sat at the legacy
slug — live, absent from the sitemap, and unlinked — while the sitemapped
canonical slug rendered a shell. The entry now carries the canonical slug and
`/lead-types/home-services-leads` 301s to it in `next.config.ts`, so the orphan
does not survive cutover as a duplicate.

One correction to what this section used to claim: the note in
`data/lead-type-vertical-map.ts` said the `home-services-leads` page "no longer
exists." It did — it returned 200 and rendered ~2,900 words. The comment is
rewritten to describe the redirect instead.

`averageCostPerLead` stays **unset** on the four new lead types. The reliable
benchmarks for these verticals span mixed age brackets and produce misleading
ranges ($20–$100 for aged auto, $1.00–$1.00 for life). Benchmarks here are
human-verified quarterly and never auto-generated. Fill them on the next
quarterly pass; do not invent them to fill the field.

---

## Phase 2 — Build

### 2a. Sanity content import · DONE

`scripts/migrate-htwl-content.mjs` exports from `e9k38j42`, transforms, and
`createOrReplace`s into `p7rbtajg`.

**blogPost → post field map:**

| HTWL `blogPost` | ALSales `post` | Note |
|---|---|---|
| title, slug, excerpt, mainImage{alt}, publishedAt | same | direct |
| content (block[], link markDef, image) | body (block[], image, table, codeBlock) | compatible portable text |
| **seoTitle** (top-level) | **seo.metaTitle** (nested) | **relocation — silently nulls metadata if missed** |
| **seoDescription** (top-level) | **seo.metaDescription** (nested) | same |
| categories (ref[]) | categories (ref[]) | remap to the 6 existing categories |
| author (ref) | author (ref) | → `author-bill-rice` |
| — | leadTypes (ref[]) | assigned per post |

Verified 2026-07-31 against `p7rbtajg/production` — 81 staged drafts:

| Check | Result |
|---|---|
| Missing `seo.metaTitle` | 0 |
| Missing `seo.metaDescription` | 0 |
| Missing `categories` | 0 |
| Missing `leadTypes` | 0 |
| Missing `mainImage` | **9** |
| Missing `publishedAt` | **2** |

The top-level→nested SEO relocation was the highest-risk transform in the whole
migration and it landed clean on all 81.

**Two traps that persist:**

- **Re-import must use `--new-only`.** The write is `createOrReplace`; a plain
  re-run silently discards editorial work on drafts already staged.
- **Portable Text is less portable than it looks.** howtoworkleads parses
  markdown *inside* span text at render time, so its documents store raw
  `**bold**`, `[text](url)`, a leading `# Title` line, and on six posts the
  authoring brief as a blockquote. The source site renders it correctly, so it
  looks clean coming in. This project renders with `@portabletext/react`, which
  prints span text verbatim. The fix lives in the import path
  (`scripts/lib/normalize-imported-blocks.mjs`) so a re-import cannot
  reintroduce it.

**Still to do on the 81:** editorial review, 9 featured images, 2 missing
`publishedAt`, and a **staggered** publish. The blog query is ungated on
`publishedAt`, so an unstaggered publish puts 81 posts live in a single day.

### 2b. Domain references — the silent-failure sweep · NOT STARTED

In priority order:

1. **`lib/anti-spam.ts` → `ALLOWED_HOSTS`.** Every capture route calls
   `isGoodOrigin()` and returns `{ success: true }` on failure **by design**. If
   the new host is not listed, every form works perfectly and captures nothing —
   no error, no log. Single highest-risk line in the migration.
   (workagedleads.com is already present as of the Phase 2c commit; verify, do
   not assume.)
2. `lib/email-course/shared.ts` → `SITE_URL` — baked into every live drip email.
3. `app/api/newsletter/route.ts` → hard-coded lead-magnet download URLs.
4. `app/api/newsletter/unsubscribe`, `app/api/flagship/signup`,
   `app/api/flagship/unsubscribe`.
5. `scripts/build-flagship-pdfs.ts` → rebuild all 6 PDFs
   (`npm run flagship:check`, then `npm run build:pdfs`), committed in the same
   commit as the copy change.

**Five site-URL env vars exist** — `NEXT_PUBLIC_APP_URL`,
`NEXT_PUBLIC_SITE_URL`, `SITE_BASE_URL`, `ALS_PUBLIC_APP_URL`, `GSC_SITE_URL`.
Update all five. Missing one produces subtle, partial breakage. Consider
collapsing to one canonical var as part of this work.

Set non-www as canonical from day one. Do not reintroduce a `www.` host.

### 2c. Redirects · DONE

`lib/migration-redirects.ts` parses `url-map.csv` at build time and emits
**path-change rules only**, spread into `next.config.ts` ahead of the
`/playbooks` catch-alls — which must stay last, because first match wins. It
throws on an unrecognised host or a duplicate source, so a malformed map fails
the build rather than shipping a redirect loop. 45 rules, all 301, none
self-referential.

**Redirect topology at cutover — the third-hop trap.** The host change is a
separate 301, so a URL whose path also changes takes two hops:
`agedleadsales.com/old` → `workagedleads.com/old` → `workagedleads.com/new`.
That is fine; Google follows short chains.

What is not fine is the third hop. `www.` is a serving domain on both sites
today and its URLs are indexed and earning. Right now www 301s to the bare host
in one hop; if the bare host is then pointed at workagedleads.com, every www URL
becomes a three-hop chain. **Point the `www.` redirect at workagedleads.com
directly, not at its bare-domain sibling.** This is Vercel domain configuration,
not code — there is nothing in this repo to change, which is exactly why it is
easy to miss.

---

### 2d. Newsletter list consolidation · APPLIED 2026-08-01

Five sources, one target. Sizes and suppression counts are in Phase 0 item 4 —
this section is the mechanism, not the numbers, because the numbers drift daily
as the ALS harvest cron runs.

`npm run newsletter:migrate` folds every source into `43fe6675-…`. Dry run by
default, `-- --apply` to write. It plans as a **diff against the target's current
state**, so it is safe to run repeatedly and **must** be run again at cutover
(Phase 5 step 9). Both retiring sites keep capturing signups until their forms
stop serving, and the ALS harvest adds buyers daily; anyone who arrives after the
last run exists only on a retiring list.

**Suppression is read from two systems, not one.** The ALS lifecycle is a
transactional sender that records opt-outs in Postgres —
`unsubscribeContact()` in `lib/als/lifecycle.ts` sets
`als_buyer_contacts.unsubscribed` and never writes to the Resend audience. So an
ALS audience row can read `unsubscribed: false` for someone who has already
unsubscribed. The script reads `als_buyer_contacts.unsubscribed` and unions it
in, and **refuses to run** when an ALS audience is a source and `DATABASE_URL` is
unset. Re-derive the union immediately before each broadcast stage rather than
trusting a number written down earlier.

**The invariant:** the only state transition this code can make on a person is
subscribed → unsubscribed. Never the reverse, from any source, in any order.
Anyone who opted out on the *target* is left alone even when a source still lists
them as subscribed. That asymmetry is what the tests hold.

**Rate limiting is part of correctness here, not politeness.** Resend allows 10
requests/second. The ALS fold is ~2,200 sequential creates; unthrottled it 429s
partway and leaves a partially migrated audience, which is indistinguishable
from a finished one until someone counts. A run did in fact stop short at 2,237
of 2,435 before the throttle went in.

**Two loose ends this does not close:**

1. `howtoworkleads.com` hard-codes its audience ID in
   `apps/web/app/api/newsletter/route.ts` and `apps/web/app/api/download/route.ts`
   — a different repo. Those routes keep writing to the retiring audience until
   that site stops serving.
2. `app/api/newsletter/unsubscribe` unsubscribes against whatever
   `RESEND_AUDIENCE_ID` currently points at. After the env flip, an unsubscribe
   link in an already-sent email lands on the new audience — correct, but only
   because everyone was migrated. Another reason the re-run is not optional.

---

## Phase 3 — Soft launch (noindexed)

1. Add `workagedleads.com` to the Vercel project. Keep agedleadsales.com
   attached and serving.
2. **Force `noindex` on the new domain via middleware keyed on hostname** — not
   a build-time env flag. Next.js evaluates env-based robots at *build* time, and
   a staging copy that ships indexable is a known failure mode on replatforms.
3. Deploy. If the git push does not trigger a build (a real and recurring issue
   on this project), run `vercel deploy --prod --yes`. If deploying from a
   worktree, copy `.vercel/project.json` from the main checkout first, or Vercel
   creates a stray project.
4. ~~Verify the Resend sending domain for workagedleads.com~~ **Done** —
   `435a8cd1-0e4e-41c9-8227-1650e5e253f2`, verified, us-east-1.
5. **Merge every source audience into `43fe6675-…`.** No broadcast — Bill
   cancelled it on 2026-08-03. Sending moves to the new domain and the
   transitional footer line in `lib/rebrand-notice.ts` does the recognition
   work, on all three newsletter surfaces. It is dated: remove after
   **2026-11-01**.

   Two constraints on the merge itself, here because getting them wrong is
   unrecoverable. **Carry the unsubscribed flag across on merge** — anyone who
   opted out of any source list must arrive opted out. And **de-duplicate**; 20
   addresses sit on both the newsletter and an ALS program.

   **The list is 2,435 distinct / ~2,368 sendable, and 90% of it never subscribed
   to a newsletter.** Bill's 2026-08-01 decision folded the three ALS programs in
   — 2,205 distinct addresses, only 20 of which were already on the newsletter
   list. Those people consented at an Aged Lead Store checkout or inquiry form;
   most have never seen either site.

   Consent is not recognition, and it is recognition that decides whether someone
   reports spam. That is why the broadcast goes first, and why it goes **in three
   stages** — newsletter minority, then Purchasers, then Inquiries — rather than
   the whole list at once from a domain with no sending history. **Stop signal: complaint
   rate at or above 0.1%.**

   Hold the newsletter, the flagship course and the ALS lifecycle until all three
   stages are clean, then wait 48 hours before repointing `RESEND_AUDIENCE_ID`
   and `RESEND_FROM_EMAIL`.

   From is `bill@workagedleads.com`, send-only. **Set Reply-To explicitly to
   `bill@billricestrategy.com`** — the inbox that already receives the `/contact`
   form. Leaving it unset sends replies nowhere.

---

## Phase 4 — Verification gate

Nothing proceeds until all of these pass **on the live workagedleads.com host**.

- [ ] **Lead capture probe.** Submit a real form on each surface — newsletter,
      flagship signup, contact — and confirm each contact appears in Resend. A
      200 response proves nothing: the origin gate returns fake success. This is
      the gate that matters most.
- [ ] Email links: trigger a welcome email and a course email; confirm every
      link resolves to workagedleads.com with no redirect hop, and unsubscribe
      works end to end.
- [ ] All 6 flagship PDFs download and are current (`npm run flagship:check`).
- [ ] Spot-check 20 migrated posts: title, meta description, canonical, OG
      image, category, lead type, featured image all populated. Confirm no post
      has a null `seo.metaTitle`.
- [ ] All four new lead-type pages render full-depth, not 310-word shells
      (Phase 1b). `/lead-types/home-services-leads` no longer resolves.
- [ ] Sitemap and `llms.txt` reflect the new domain and the post-prune URL set.
- [ ] Crons green against the new domain: `gsc-trend`, `health-check`,
      `als-lifecycle`, `als-email-report`, `marketwatch`. The WIF/OIDC path must
      still return a token — if `getVercelOidcToken()` fails, the GCP binding
      needs attention before cutover.
- [ ] `node scripts/verify-redirects.mjs --mode=post` passes: every `old_url`
      and its www variant returns a single 301 to a live 200. Zero chains, zero
      404s, no `PRUNE` row still resolving.
- [ ] `noindex` confirmed present while staged, and confirmed *removable* by the
      mechanism you intend to use.

---

## Phase 5 — Cutover (one day)

Order matters.

1. Baseline the day before: GSC clicks/impressions for both domains, Resend list
   size, affiliate rev-share run-rate.
2. Add + verify GSC properties for workagedleads.com — **both URL-prefix and
   domain**. The URL-prefix property is required because the disavow tool does
   not accept domain properties.
3. Grant `brsg-analytics-reader@brsg-mcp.iam.gserviceaccount.com` access to the
   new GSC property and GA4 property. Update `GSC_SITE_URL`.
4. **Submit the merged disavow on the new property.** None of the existing
   disavow protection follows a 301, and both source profiles are ~95% PBN spam.
5. Remove `noindex`. Confirm removed on the live host.
6. Fire the 301s: agedleadsales.com → workagedleads.com, howtoworkleads.com →
   workagedleads.com, per the CSV.
7. Submit Change of Address in GSC for **both** source properties.
8. Re-run the lead-capture probe post-cutover. Do not assume Phase 4 still holds.
9. **Re-run the list consolidation before any send.** `npm run newsletter:migrate`
   (dry run) → `-- --apply`. Not optional: both retiring sites capture signups
   until their forms stop serving and the ALS harvest adds buyers daily, so
   anyone who arrived since the last run exists only on a retiring list. See
   § 2d. Re-derive the suppression union from the fresh run — do not reuse a
   count written down earlier.
10. Repoint `RESEND_AUDIENCE_ID` to `43fe6675-…` **and** `RESEND_FROM_EMAIL`
    to the workagedleads.com sender, and redeploy. **Both flip together** —
    flipping one without the other splits the list again. No launch broadcast;
    the next scheduled newsletter is the first send from the new domain and it
    carries the footer notice.
11. Update the UTM source in `lib/affiliate.ts` to the single new value.

**Keep both old domain registrations and their 301s indefinitely.** *(Superseded 2026-11-19: registrations stay indefinitely, but the 301s switch to `410 Gone` on or after 2027-03-01 — see BACKLOG.md "Retire agedleadsales.com and howtoworkleads.com".)* Every other
referring domain still points at the old URLs.

**Expect an impressions collapse, and do not read it as a regression.** The 16
pruned generic pages carry ~27,000 impressions (37% of the site total) against
11 clicks, at positions 39–70. Track clicks and conversions through cutover, not
impressions.

---

## Phase 6 — Post-cutover

- **Week 1:** daily GSC + Resend + rev-share watch against the Phase 5 baseline.
  Watch indexation of new URLs and de-indexation of old.
- **Weeks 2–4:** once new URLs are indexed and 301s confirmed live, run **Batch
  3** from `als-backlink-placements.html` — the agedleadstore.com URL swap across
  1,312 link instances. Re-crawl agedleadstore.com afterwards to confirm zero
  references to retired domains remain. Do not run this before the 301s are live.
- Re-engagement sequence to the active subscribers; prune non-openers rather
  than carrying dead weight onto a new sending domain.
- Then growth: review/compare/best-provider as the primary page type; MCA
  (~620/mo) and solar (~220/mo) vertical clusters; instrument `/register` and
  subscriber→register conversion.
- Move disavow regeneration to monthly.
- Archive the howtoworkleads repo and Sanity dataset (do not delete).

---

## Verification

**Redirect integrity** — `node scripts/verify-redirects.mjs --mode=post`, which
probes every row **and its www variant** and fails on hop count, wrong
destination, or a `PRUNE` row that still resolves.

**Lead capture** — real form POST, then confirm the contact via the Resend API
against audience `d579bf1f-0467-45a3-ad6b-52460920a903`. Probe the destination;
the HTTP response is not evidence.

**Content parity** — GROQ count by type against `p7rbtajg` before and after
import; assert `post` count equals pre-migration + imported − merged − pruned,
and that no migrated post has a null `seo.metaTitle`.

**Analytics** — hit each cron route with `CRON_SECRET` and confirm a 200 plus a
written artifact (`data/gsc-trend.json` gains a dated snapshot).

**Search** — GSC URL Inspection on 10 representative new URLs; confirm indexable
and canonical to workagedleads.com.

---

## Rollback

Reversible up to Phase 5 step 5 (`noindex` removal). Before that, the new domain
is invisible and agedleadsales.com is still serving normally — revert by removing
the domain from the project.

After the 301s fire, rollback means reversing them and re-serving the old
domains; rankings recover but not instantly. The Phase 0 Sanity exports are the
content backstop — **which is why Phase 0 item 3 is not optional bookkeeping.**

**Point of no return:** Change of Address submission (Phase 5 step 7). Do not
submit until the capture probe has passed post-cutover.

---

## Open risks

1. ~~Attribution mechanics unconfirmed.~~ **Closed 2026-08-01 — UTM-keyed.**
2. **Spam profile transfers through the 301s.** ~500 referring domains,
   overwhelmingly PBN. The migration does not escape it — it inherits it,
   temporarily without the disavow protection. Phase 5 step 4 is the mitigation
   and it is not optional.
3. **Vercel deploy flakiness** on this project — pushes sometimes do not trigger
   builds. Verify every deploy landed; do not assume.
4. **The fold is the largest manual effort in the plan and the easiest to
   under-scope.** It is copy harvesting and page building (Phase 1b), not
   scripting. It carries 60% of the migration's clicks.
5. **Phase 0 items 2–4 are still open** — rev-share baseline, Sanity exports,
   Resend export. Items 3 and 4 are the rollback backstop; item 2 is the only
   thing that will tell us afterwards whether this worked.
