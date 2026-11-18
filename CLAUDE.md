# Claude agent notes for this repo

Project-specific guidance for Claude Code sessions working in `agedlead-sales/`. General Claude Code conventions (from `~/Documents/CLAUDE.md`) still apply.

## What this repo is

BRSG-owned affiliate training site — SEO content + lead magnets targeting sales professionals who buy aged leads. Stack: Next.js 16 + Sanity + Tailwind v4 + Resend + Anthropic. Affiliate links to `agedleadstore.com` with UTM tagging via `lib/affiliate.ts`.

## Flagship lead magnet — "The Aged Lead Operator's System"

The site's cornerstone funnel. Playbook + workbook + 5-email course in 3 verticals (mortgage, insurance, home-services).

**Full system docs:** [`content/flagship-magnet/README.md`](content/flagship-magnet/README.md). Read it before editing anything in `content/flagship-magnet/`, `lib/email-course/`, `app/(site)/playbook/`, or `app/api/flagship/`.

### MUST DO: after editing flagship markdown

When you edit **any file** in `content/flagship-magnet/` (master playbook, vertical overlay, workbook), the PDFs in `public/downloads/` go stale. Your responsibility:

```bash
npm run flagship:check      # report any stale PDFs (exits 1 if stale)
npm run build:pdfs          # rebuild all 6 PDFs (30 sec)
```

Commit the updated PDFs in the **same commit** as the markdown change. `flagship:check` also flags staleness if `scripts/build-flagship-pdfs.ts` itself is edited (template/styling changes).

### MUST DO: after editing email course content

The email course lives in two parallel places:

- `content/flagship-magnet/emails/{vertical}.md` — human-readable source of truth for the copy
- `lib/email-course/{vertical}.ts` — live TypeScript modules sent by Resend

They are maintained in parallel — no auto-generation yet. If you change one, change the other. Test locally that both files reflect the same copy before committing.

### Compliance language — do not drift

The flagship carries a specific compliance framing across every asset:

- **Mode A / Mode B / Mode C** disclaimer (not white-hat / gray-hat / black-hat)
- **Fresh-Consent Ladder** — 6 plays, detailed in master playbook Part IV
- **[Henson Legal](https://www.henson-legal.com/)** as the named TCPA counsel — do not substitute another firm without Bill's approval
- Current 2026 legal state: FCC 1:1 rule **vacated** (Jan 2025), repealed (Aug 2025); revocation-all delayed to **Jan 2027**; state mini-TCPAs in FL (FTSA), OK (OTSA), WA (HB 1497), MD, TX

If legal guidance in one file changes, cross-check the other content files and the live TS email modules to keep them consistent.

## SEO data: DataForSEO only. Never Ahrefs.

BRSG has no Ahrefs account and never has. Third-party SEO data for BRSG sites (rankings, keyword volumes, backlinks, competitors, top pages) comes from **DataForSEO**: its API in code (`DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`), or the DataForSEO MCP in Claude sessions.

- Do not call Ahrefs, add an Ahrefs key, or suggest Ahrefs as a fix, fallback or purchase.
- DataForSEO's domain `rank` is its own 0–1000 scale. Never call it "DR" or "Domain Rating".
- First-party data (Search Console, GA4) outranks any third-party estimate. Label DataForSEO numbers as estimates.

Older notes in BACKLOG.md and `docs/` cite Ahrefs pulls and "DR" figures from before this rule. They are historical records, not a source to repeat. `scripts/refresh-disavow.ts` and `scripts/build-merged-disavow.ts` still parse old Ahrefs CSV exports; feed them a plain one-domain-per-line list from DataForSEO instead.

## Daily cron commits to main

A Vercel cron (`gsc-trend`, 12:00 UTC daily) auto-commits `data/gsc-trend.json` to `main` — the disavow / toxic-backlink tripwire. Before pushing your own work to `main`, always `git fetch origin main && git pull --rebase origin main` to avoid non-fast-forward rejects. (The old `daily-performance` cron — which also committed `performance-backlog.json` — was unscheduled 2026-07-03; its report is superseded by the consolidated BRSG Portfolio Performance Report. The route survives for manual runs.)

## Sanity dataset notes

- 4 legacy playbook docs (pb-7-day-aged-lead-cadence, pb-final-expense-kitchen-table-close, pb-mortgage-rate-shopping-playbook, pb-aged-lead-roi-tracking) are **unpublished** (drafts preserved). `/playbooks/*` routes 301 to `/playbook`. Do not republish these without Bill's explicit approval — they conflict with the flagship funnel.
- `scripts/unpublish-old-playbooks.ts` is the one-off script that did it. Keep it for reference; don't re-run.

## Commit/deploy

- Never commit `.env.local`, `.env`, or anything with `RESEND_API_KEY`, `SANITY_API_TOKEN`, `ANTHROPIC_API_KEY` values.
- PDFs in `public/downloads/` **are** committed (they're the deliverable; static-served).
- Pushing to `main` = Vercel production deploy. Always confirm with Bill before pushing unless he's asked for a specific autonomous push.
