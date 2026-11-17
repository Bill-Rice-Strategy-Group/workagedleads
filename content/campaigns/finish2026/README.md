# FINISH2026: November 2026 month-end push

**Goal:** close the gap from about $280 to $2,000 in likely commission by Nov 30.
At 16% effective (20% rev share × 80% realisation), that means about **$10,750 in
attributed revenue**. Returning buyers earn about $114 per session, compared with
about $5 for cold traffic, so most of this campaign goes to people who already buy.

**Code:** `FINISH2026`, 30% off. **It does not expire**, and orders using it credit our affiliate account (both confirmed by Bill, 2026-11-17). Nov 30 is our revenue target, not the reader's deadline, so no copy anywhere may give the code an end date. The tests enforce this for the emails.

All links are tagged `utm_campaign=finish2026`. The daily commission email reports the pace.

## Partner terms

Recorded in `data/campaigns/finish2026.json` as `partnerConfirmed`. `--apply` refuses
to run unless it says the code doesn't expire and that orders credit us. Still open:
whether commission is paid on the discounted total.

## Calendar

| Date | Touch | Built by |
|---|---|---|
| Wed 11/18, 8am ET | Launch email to the main list | `scripts/finish2026-schedule.ts` |
| Wed 11/18 to Fri 11/20 | Personal notes to top buyers (below) | Bill, by hand |
| Once merged | Site-wide promo bar, hides itself after Dec 31 (`FINISH2026_PROMO_UNTIL`) | `components/promo-bar.tsx` |
| Tue 11/24 | Code mentioned in the newsletter | `data/newsletter-calendar.ts` specialHook |
| Fri 11/27 (Black Friday) | "The one Black Friday buy that pays you back in January" | `scripts/finish2026-schedule.ts` |
| Mon 11/30 | "December goes fast. January's leads don't have to wait." | `scripts/finish2026-schedule.ts` |

## Running the sends

```bash
npx tsx scripts/finish2026-schedule.ts            # dry run: renders, gates, counts the list
npx tsx scripts/finish2026-schedule.ts --test     # all 3 to Bill only
npx tsx scripts/finish2026-schedule.ts --apply    # schedules in Resend (needs partnerConfirmed)
```

To cancel any send, delete its broadcast in the Resend dashboard. If the script
first runs after 11/18 13:00 UTC, the launch email is skipped and the other two
still schedule. If that happens, send the launch by hand with a new date.

---

## Personal notes to top buyers

**Who:** the 25–50 biggest past buyers from the `ALS-orders` Gmail label, chosen
by order size and how recently they bought. Send from your own inbox, one at a
time, in plain text, using their first name.

**Rules:** don't say or imply that you buy leads yourself. Don't quote prices.
These are commercial emails, so CAN-SPAM still applies even when sent one at a
time. Keep the opt-out line and the postal address in the signature.

Link for these notes (tagged so personal-note sales can be counted separately):

```
https://agedleadstore.com/all-lead-types/?utm_source=workagedleads&utm_medium=email&utm_campaign=finish2026&utm_content=personal-note
```

### Version A: the January pipeline

> **Subject:** 30% off for your January restock
>
> Hi {first name},
>
> Quick one. Aged Lead Store is taking 30% off with code FINISH2026.
>
> Since you already buy from them, this is a good chance to load up your January
> leads now, before everyone else rebuilds their pipeline in the first week of
> the year.
>
> {link}
>
> Bill
>
> --
> Bill Rice · Aged Leads Insights · 750 E. Hurd Rd., Monroe, MI 48162
> Affiliate link: I may earn a commission. Reply "stop" and I won't email you about offers again.

### Version B: the question

> **Subject:** quick question about January
>
> Hi {first name},
>
> Have you planned your lead buy for January yet?
>
> I ask because Aged Lead Store has a 30% off code running right now
> (FINISH2026). If you were going to restock after the holidays anyway, buying
> now gets you the same leads for 30% less, and you can start dialing on day one.
>
> {link}
>
> Happy Thanksgiving,
> Bill
>
> --
> Bill Rice · Aged Leads Insights · 750 E. Hurd Rd., Monroe, MI 48162
> Affiliate link: I may earn a commission. Reply "stop" and I won't email you about offers again.

### Version C: the follow-up (only to people who replied or clicked)

> **Subject:** Re: 30% off for your January restock
>
> Hi {first name}, if it helps to have January's leads in your CRM before the
> holidays, FINISH2026 still takes 30% off. {link}
>
> Bill

---

## Outside this repo

- **howtoworkleads.com header bar.** Its header link earned $9,132 in July, more
  than any other placement we have. Put the same one-line promo there, tagged
  `utm_campaign=finish2026&utm_content=htwl-header`.
- **LinkedIn post (11/18 or 11/19).** "Agents: stock your January pipeline before
  the year closes. Aged Lead Store is 30% off with FINISH2026." Tag the link `utm_medium=social&utm_content=linkedin`.
