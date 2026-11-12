/**
 * Newsletter Content Calendar for Work Aged Leads
 *
 * Cadence: one issue per week, Tuesday. The Sunday cron drafts it and emails
 * Bill a preview; `scripts/send-newsletter.ts` is the only thing that can mail
 * the list. `sendDate` is the TUESDAY — that is the value the cron matches on.
 *
 * Newsletter structure:
 *   - Personal intro from Bill Rice
 *   - Featured article spotlight
 *   - 2-3 exclusive quick tips (not published on the blog)
 *   - This week on the blog
 *   - Industry data point or trend
 *   - Store CTAs (hero, vertical self-select strip, footer)
 *
 * ── WHY THIS FILE WAS REBUILT (2026-09-02) ──
 *
 * The previous calendar ran 2026-03-17 -> 2026-06-02 and then simply ran out.
 * Because `findCurrentPlan` fell back to a +/-7-day window and then to `null`,
 * every issue from 2026-06-08 onward was drafted with NO plan and archived with
 * `theme: "AI-generated"` — thirteen consecutive weeks in which the model chose
 * its own subject and nothing anywhere said the calendar had expired. An empty
 * calendar and a working calendar produced identical-looking output.
 *
 * Two things changed alongside this rebuild:
 *   1. Matching is EXACT on `sendDate`. The old +/-7-day fuzz could silently
 *      serve the *previous* week's plan for a send, which is worse than serving
 *      none — you get a stale theme that looks deliberate.
 *   2. Expiry is LOUD. The draft script and the Sunday preview both say, in
 *      words, when no plan matched and how many issues remain. See
 *      `calendarStatus()` below.
 *
 * ── TOPIC-THEMED, NOT VERTICAL-ROTATED (Bill, 2026-09-01) ──
 *
 * The old calendar rotated a `focusVertical` (Insurance, Mortgage, ...). Q4 is
 * organised by TOPIC instead — the job the reader is trying to do that week.
 * `focusVertical` is therefore optional and omitted throughout. The store CTA
 * strip already lets every reader self-select their own vertical, which does
 * that job better than guessing one for the whole list.
 *
 * History is not kept here. The archive in `data/newsletter-archive/` is the
 * record of what actually shipped; this file is forward-looking only.
 */

export interface NewsletterPlan {
  week: number;
  /** The Tuesday, YYYY-MM-DD. Matched EXACTLY — see the note above. */
  sendDate: string;
  theme: string;
  /**
   * Legacy vertical rotation. Optional and unused in Q4 by decision; kept so
   * older tooling and archived records still type-check.
   */
  focusVertical?: string;
  exclusiveTipTopics: string[];
  specialHook?: string;
  status: "sent" | "scheduled" | "planned";
}

/**
 * "Compliance Corner" was deliberately REMOVED from this list on 2026-09-02.
 *
 * Bill's call, and it is a scope decision rather than a topic preference: once
 * these issues send on an opt-out window, a compliance issue means AI-restated
 * law reaching thousands of licensed agents with no guaranteed human read. The
 * house rule is that compliance claims verify to statute, CFR or an agency
 * order — never to a model's restatement of them — and that rule cannot be
 * enforced by a prompt.
 *
 * The compliance material still exists and still differentiates the site; it
 * lives in the flagship playbook and on-site pages, where Bill writes and
 * reviews it directly. If a compliance issue is ever wanted here, it should be
 * hand-written and excluded from auto-send, not scheduled.
 */
export const NEWSLETTER_THEMES = [
  "The Numbers Game",
  "Scripts That Close",
  "Channel Deep Dive",
  "Tech & Tools",
  "Scaling Up",
  "The Aged Lead Mindset",
  "ROI Breakdown",
  "Seasonal Strategy",
] as const;

export const NEWSLETTER_CALENDAR: NewsletterPlan[] = [
  {
    week: 1,
    sendDate: "2026-09-08",
    theme: "Tech & Tools",
    exclusiveTipTopics: [
      "Know Your CPL: what you can actually afford to pay per lead, given your close rate",
      "The Pipeline Calculator: reverse-engineer a revenue target into dials per day",
      "The Lead Price Index: what the market pays right now, by vertical and lead age",
    ],
    specialHook:
      "VALUE-FIRST TOOLS ISSUE. Bill's call 2026-09-02: most of this list does not know these tools exist. Walk through the free calculators, the Lead Price Index, the glossary and the provider comparisons — what each one answers and when to reach for it. This issue follows the 2026-09-10 direct offer send, so it is deliberately a GIVE: teach the tools, do not push the store. Keep the standard store CTAs but let the tools carry the issue.",
    status: "planned",
  },
  {
    week: 2,
    sendDate: "2026-09-15",
    theme: "The Numbers Game",
    exclusiveTipTopics: [
      "Work backwards: your Q4 revenue target divided by close rate is your lead volume",
      "Why lead COST is the least important number in the equation",
      "The break-even table every buyer should build before their next order",
    ],
    specialHook:
      "Q4 planning math. Pairs naturally with the pipeline calculator introduced last week.",
    status: "planned",
  },
  {
    week: 3,
    sendDate: "2026-09-22",
    theme: "Scripts That Close",
    exclusiveTipTopics: [
      "The opener that works when the lead filled the form four months ago",
      "How to reference the original inquiry without sounding like a stalker",
      "The three-sentence voicemail that gets returned",
    ],
    specialHook:
      "Aged-specific scripting — the objection is always 'that was a while ago'.",
    status: "planned",
  },
  {
    week: 4,
    sendDate: "2026-09-29",
    theme: "Seasonal Strategy",
    exclusiveTipTopics: [
      "The October reset: re-segment your unworked leads before Q4 starts",
      "Which aged leads deserve a second cadence and which are genuinely dead",
      "Setting a weekly buy rhythm instead of one big quarterly order",
    ],
    specialHook: "Last issue before Q4. Housekeeping and pipeline posture.",
    status: "planned",
  },
  {
    week: 5,
    sendDate: "2026-10-06",
    theme: "Seasonal Strategy",
    exclusiveTipTopics: [
      "Medicare AEP opens October 15 — what that does to lead supply and price",
      "ACA open enrollment starts November 1: staffing the phone for the surge",
      "Why the weeks BEFORE an enrollment window are the cheapest place to buy",
    ],
    specialHook:
      "Enrollment-season timing. Dates are load-bearing here — AEP Oct 15-Dec 7, ACA opens Nov 1. Verify both against CMS before publishing; do not let the model restate them from memory.",
    status: "planned",
  },
  {
    week: 6,
    sendDate: "2026-10-13",
    theme: "Channel Deep Dive",
    exclusiveTipTopics: [
      "Email first, call second: why the order matters more on aged data",
      "The best hours to dial by vertical, and the evidence behind them",
      "How many touches before you stop — and what the data actually says",
    ],
    status: "planned",
  },
  {
    week: 7,
    sendDate: "2026-10-20",
    theme: "The Numbers Game",
    exclusiveTipTopics: [
      "Testing a new lead source without betting the quarter on it",
      "How small a test batch can be before it tells you nothing",
      "The three numbers that decide whether you scale a source or cut it",
    ],
    specialHook:
      "Operational testing methodology — sample size, controls, and reading a result honestly. Pairs with the calculators from week 1.",
    status: "planned",
  },
  {
    week: 8,
    sendDate: "2026-10-27",
    theme: "Scripts That Close",
    exclusiveTipTopics: [
      "The 7-day cadence, hour by hour",
      "What to change on touch four when the first three got nothing",
      "The re-engagement text that does not read as spam",
    ],
    status: "planned",
  },
  {
    week: 9,
    sendDate: "2026-11-03",
    theme: "Scaling Up",
    exclusiveTipTopics: [
      "CRM hygiene before year-end: the five fields that decide whether you can measure anything",
      "Disposition codes that tell you something useful",
      "Why 'no answer' is not a disposition",
    ],
    status: "planned",
  },
  {
    week: 10,
    sendDate: "2026-11-10",
    theme: "ROI Breakdown",
    exclusiveTipTopics: [
      "Cost per acquisition, honestly — including the hours you do not bill yourself for",
      "Comparing aged against real-time on CPA rather than on lead price",
      "The one report to run monthly, and what a healthy one looks like",
    ],
    status: "planned",
  },
  {
    week: 11,
    sendDate: "2026-11-17",
    theme: "Channel Deep Dive",
    exclusiveTipTopics: [
      "Track conversations per 100 dials for each phone number, weekly; a sharp one-week drop on the same kind of leads usually means a carrier spam label, so test the number on Verizon, T-Mobile and AT&T before buying new leads or rewriting the script",
      "Write emails that ask one short question a reader can answer in a few words ('Did you ever get your burial coverage sorted out?'), with no logo, product list or rate table; a reply is the best reason to call",
      "Sort Monday's list by what each lead did with your email (replied, clicked, opened only, nothing) and call in that order; opens are unreliable because Apple Mail records many automatically",
    ],
    specialHook:
      "Swapped in by Bill on 2026-11-12 (was 'Scripts That Close', moved to 2027-01-05). Built on a real reader letter: a 69-year-old final expense agent who used to reach about 5 people per 10 calls and now sometimes makes 70-80 calls a day and reaches no one; he wants a 2-3 day week. PARAPHRASE him, never quote him, never name him or his town. The argument: most people now ignore unknown numbers, and a number making high-volume unanswered calls gets labeled 'Spam Likely', so dialing harder makes it worse; the fix is email first to find who is still interested, then call those people. FEATURE the post with slug '70-dials-nobody-answers-email-decides-who-you-call'. Industry insight: Hiya's 2026 State of the Call survey (12,000+ consumers, six countries) found only 14% immediately answer unknown numbers; Pew (2020, U.S.) found about 8 in 10 adults don't generally answer unknown cellphone calls. Name Hiya as a call-screening company. Do NOT restate texting or TCPA law in this issue; point to the featured article for that.",
    status: "planned",
  },
  {
    week: 12,
    sendDate: "2026-11-24",
    theme: "Seasonal Strategy",
    exclusiveTipTopics: [
      "Thanksgiving week: fewer dials, better ones",
      "Why the days either side of a holiday have unusually high contact rates",
      "Setting up December before you take time off",
    ],
    specialHook: "Thanksgiving is Nov 26. Keep this issue short — people are travelling.",
    status: "planned",
  },
  {
    week: 13,
    sendDate: "2026-12-01",
    theme: "The Aged Lead Mindset",
    exclusiveTipTopics: [
      "December is not dead — who is actually answering the phone this month",
      "The year-end urgency that is real, and the kind you should not manufacture",
      "Buying in December for a January start",
    ],
    status: "planned",
  },
  {
    week: 14,
    sendDate: "2026-12-08",
    theme: "The Numbers Game",
    exclusiveTipTopics: [
      "Building your 2027 lead budget from this year's actual close rate",
      "How to phase a budget so one bad month does not end the program",
      "What to renegotiate with your provider before January",
    ],
    status: "planned",
  },
  {
    week: 15,
    sendDate: "2026-12-15",
    theme: "ROI Breakdown",
    exclusiveTipTopics: [
      "The year in review: pull your own numbers and read them honestly",
      "Which vertical actually paid you, as opposed to which felt busiest",
      "The one change that would have made the biggest difference this year",
    ],
    specialHook: "Annual retrospective. Encourage readers to run their own numbers in the calculators.",
    status: "planned",
  },
  {
    week: 16,
    sendDate: "2026-12-22",
    theme: "Seasonal Strategy",
    exclusiveTipTopics: [
      "The quiet-week playbook: what to do when nobody picks up",
      "Cleaning and re-scoring your list while the phones are slow",
      "Writing next year's scripts while this year is still fresh",
    ],
    specialHook: "Christmas week. Short, practical, low-pressure. No selling.",
    status: "planned",
  },
  {
    week: 17,
    sendDate: "2026-12-29",
    theme: "Scaling Up",
    exclusiveTipTopics: [
      "Set up January: the first week decides the quarter",
      "Your opening buy of the year, sized from your own capacity",
      "The weekly rhythm to hold yourself to in Q1",
    ],
    specialHook: "Final issue of 2026. Forward-looking; sets up the Q1 calendar.",
    status: "planned",
  },
  {
    week: 18,
    sendDate: "2027-01-05",
    theme: "Scripts That Close",
    exclusiveTipTopics: [
      "The objection library: the eight you will actually hear",
      "'I already bought' — the highest-value objection there is",
      "How to end a call so the follow-up is expected rather than intrusive",
    ],
    specialHook: "Moved here from 2026-11-17 on 2026-11-12 to make room for the reader-letter issue.",
    status: "planned",
  },
];

/**
 * The plan for a given send date, matched EXACTLY.
 *
 * Exact by design. The previous implementation fell back to any plan within
 * seven days, which meant a send could quietly inherit the PREVIOUS week's
 * theme — a stale issue that reads as deliberate. A miss should be visible, so
 * it returns undefined and `calendarStatus()` explains why.
 */
export function findPlanForDate(sendDate: string): NewsletterPlan | undefined {
  return NEWSLETTER_CALENDAR.find((p) => p.sendDate === sendDate);
}

export interface CalendarStatus {
  plan?: NewsletterPlan;
  /** True when this date has a plan. */
  matched: boolean;
  /** Planned issues still ahead of this date, this one excluded. */
  remaining: number;
  /** The last date this calendar covers. */
  lastDate: string;
  /** One line, safe to drop straight into a preview email or a console. */
  message: string;
}

/**
 * Why this exists: the calendar expired on 2026-06-02 and ran empty for
 * thirteen weeks without a single signal. Silence was the bug. Every caller
 * that drafts an issue should print this.
 */
export function calendarStatus(sendDate: string): CalendarStatus {
  const plan = findPlanForDate(sendDate);
  const lastDate =
    NEWSLETTER_CALENDAR.length > 0
      ? NEWSLETTER_CALENDAR[NEWSLETTER_CALENDAR.length - 1].sendDate
      : "(empty)";
  const remaining = NEWSLETTER_CALENDAR.filter((p) => p.sendDate > sendDate).length;

  if (plan) {
    const tail =
      remaining === 0
        ? ` This is the LAST issue on the calendar — extend it before next week.`
        : remaining <= 3
          ? ` Only ${remaining} issue(s) left after this one (through ${lastDate}) — extend the calendar soon.`
          : ` ${remaining} issue(s) remain, through ${lastDate}.`;
    return {
      plan,
      matched: true,
      remaining,
      lastDate,
      message: `Calendar: "${plan.theme}" for ${sendDate}.${tail}`,
    };
  }

  return {
    matched: false,
    remaining,
    lastDate,
    message:
      `NO CALENDAR PLAN for ${sendDate}. The model will invent its own theme, ` +
      `which is what happened silently for 13 weeks after the last calendar ran ` +
      `out on 2026-06-02. This calendar covers through ${lastDate}. ` +
      `Add an entry in data/newsletter-calendar.ts before sending.`,
  };
}
