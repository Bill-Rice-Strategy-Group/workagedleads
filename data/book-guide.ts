/**
 * workagedleads.com/book — the living companion to the appendix of
 * *Nobody Answers* (Bill Rice). Spec: WEB-GUIDE.md in the aged-lead-book repo.
 *
 * THE URL IS PRINTED. `/book` is in the book and in a QR code on paper that
 * will be in circulation for years. It must never 404. If this content ever
 * moves, `/book` redirects to it; it is never deleted or renamed. The section
 * ids below are anchors (`/book#house-rules`) and are just as permanent: add
 * new ones, never rename old ones.
 *
 * SAME NAMES AS THE BOOK. Section titles and the terms inside them (the never
 * list, *Today* page, call brief, after-call note, long list, Mode A,
 * Fresh-Consent Ladder) are the book's words. A reader should be able to go
 * from a chapter to the matching section without translating.
 *
 * WHAT GOES HERE AND WHAT DOESN'T. The printed appendix names no products,
 * menus or prices on purpose. This page is where those live, and every
 * tool-specific claim on it must be checked against the vendor's current
 * product or help docs at the time it is written, then re-checked quarterly.
 * Never from memory.
 */

/**
 * - `ready`: written and checked. Shows a "Last checked" stamp.
 * - `coming`: not written yet. Shows a pointer back to the book's appendix
 *   step, which already covers the job without tools.
 * - `legal-review`: compliance content (texting, consent, Do Not Call, AI
 *   voices, email law). Never shown publicly until Henson Legal has reviewed
 *   it AND Bill has confirmed that review. Flip to `ready` only then, and
 *   record the review in `legalReviewedOn`.
 */
export type BookSectionStatus = "ready" | "coming" | "legal-review";

export interface BookSection {
  /** Permanent anchor. Never rename. */
  id: string;
  title: string;
  /** Where it lives in the printed appendix. */
  appendixStep: string;
  /** Where the idea comes from in the chapters, for readers going book → site. */
  chapter?: string;
  status: BookSectionStatus;
  /** "YYYY-MM". Required when status is `ready`. */
  lastChecked?: string;
  /**
   * True for anything whose content is legal guidance. Such a section can only
   * be `ready` with `legalReviewedOn` set.
   */
  needsLegalReview: boolean;
  /** "YYYY-MM-DD" of the Henson Legal review Bill confirmed. */
  legalReviewedOn?: string;
  /** One line on what the web version adds over the book. */
  adds: string;
}

export const BOOK_SECTIONS: BookSection[] = [
  {
    id: "start-here",
    title: "Start here",
    appendixStep: "What You Need",
    chapter: "Chapter 4",
    status: "coming",
    needsLegalReview: false,
    adds:
      "Which assistants we recommend on a business plan and what each costs, how to keep your conversations out of training in each one, and what never to paste in.",
  },
  {
    id: "never-list",
    title: "The never list",
    appendixStep: "The Rules Come First",
    chapter: "Chapter 8",
    status: "ready",
    lastChecked: "2026-11",
    // The quote itself is the book's text. The planned legal-status table is
    // the legal part and is held back separately on the page (see
    // NEVER_LIST_STATUS_TABLE below), so it can't ship by accident with this.
    needsLegalReview: false,
    adds:
      "The list to print and hang up. Coming after legal review: the current legal status of each line, with dates.",
  },
  {
    id: "build-the-list",
    title: "Build the list",
    appendixStep: "Step 1",
    chapter: "Chapter 2",
    status: "ready",
    lastChecked: "2026-11",
    needsLegalReview: false,
    adds:
      "A spreadsheet template with the twelve columns and the status values, the five numbers, and the calculators.",
  },
  {
    id: "house-rules",
    title: "House rules",
    appendixStep: "Step 2",
    chapter: "Chapter 6",
    status: "ready",
    lastChecked: "2026-11",
    needsLegalReview: false,
    adds: "House rules to copy and paste, and where each assistant keeps standing instructions.",
  },
  {
    id: "today-page",
    title: "The Today page",
    appendixStep: "Step 3",
    chapter: "Chapter 11",
    status: "ready",
    lastChecked: "2026-11",
    needsLegalReview: false,
    adds: "Three ways to build it: a spreadsheet tab, an email folder, or a notes page.",
  },
  {
    id: "email-series",
    title: "The email series",
    appendixStep: "Step 4",
    chapter: "Chapters 4 and 7",
    // Carries the CAN-SPAM checklist, which is legal guidance.
    status: "legal-review",
    needsLegalReview: true,
    adds:
      "A request to copy for each of the four emails, sample emails, the CAN-SPAM checklist, keeping drafts as drafts in each email provider, and sending pace.",
  },
  {
    id: "call-brief",
    title: "The call brief and the after-call note",
    appendixStep: "Step 5",
    chapter: "Chapter 6",
    status: "ready",
    lastChecked: "2026-11",
    needsLegalReview: false,
    adds: "Requests to copy and paste, and a call-brief card to print.",
  },
  {
    id: "promises",
    title: "The promises",
    appendixStep: "Step 6",
    chapter: "Chapter 7",
    status: "coming",
    needsLegalReview: false,
    adds: "Connecting the assistant to your calendar, tool by tool, and the \"later\" series.",
  },
  {
    id: "permission-to-text",
    title: "Asking permission to text",
    appendixStep: "Step 7",
    chapter: "Chapter 8",
    status: "legal-review",
    needsLegalReview: true,
    adds:
      "The full Fresh-Consent Ladder, how to record and store proof, and Mode A, B and C.",
  },
  {
    id: "referral-moments",
    title: "Referral moments",
    appendixStep: "Step 8",
    chapter: "Chapter 9",
    status: "coming",
    needsLegalReview: false,
    adds: "The weekly request to copy, and a sample note a client can forward.",
  },
  {
    id: "long-list",
    title: "The long list",
    appendixStep: "Step 9",
    chapter: "Chapter 10",
    status: "ready",
    lastChecked: "2026-11",
    needsLegalReview: false,
    adds: "Twelve months of long-list topics and the monthly numbers template.",
  },
  {
    id: "sort-the-week",
    title: "Sort the week",
    appendixStep: "Step 10",
    chapter: "Chapter 11",
    status: "coming",
    needsLegalReview: false,
    adds: "The paperwork checklist and a sample three-day week.",
  },
];

/**
 * The never list, exactly as printed in the appendix. Do not add, cut or
 * soften a line here. Explanations go next to it on the page, never in it.
 *
 * Chapter 8 prints the same six lines with "(Hank's line)" after line six; the
 * appendix prints it without. The appendix version is what readers are told to
 * hang up, so it is the one quoted.
 */
export const NEVER_LIST = {
  lead: "The machine is never allowed to:",
  lines: [
    {
      bold: "Pretend to be you on the phone.",
      rest: " No AI voices, no clones, no robots calling people.",
    },
    {
      bold: "Text anyone who hasn't given you permission directly,",
      rest: " and recorded when and how.",
    },
    { bold: "Send anything you haven't read.", rest: "" },
    {
      bold: "Decide who is worth calling without you looking.",
      rest: " It can sort; you decide.",
    },
    { bold: "Make a promise you didn't make.", rest: "" },
  ],
  sixth: "6. Be the reason somebody stops answering their phone.",
  fromChapter4: [
    "When anyone says stop, in any words, on any channel, stop everything,",
    "If a tool sends something for you, you are still responsible for it.",
  ],
} as const;

/**
 * Held back until Henson Legal reviews it and Bill confirms. While false, the
 * page shows that the table is coming and nothing else.
 */
export const NEVER_LIST_STATUS_TABLE_REVIEWED = false;

/** Changelog for /book/changes. Newest first, one line per change. */
export interface BookChange {
  /** "YYYY-MM-DD" */
  date: string;
  /** Section id, if the change is to one section. */
  section?: string;
  text: string;
}

export const BOOK_CHANGES: BookChange[] = [
  {
    date: "2026-11-28",
    text: "Guide opened: the never list, the list template, house rules, the Today page, the call brief and after-call note, and the long list.",
  },
];

export const SPREADSHEET_TEMPLATE = {
  href: "/downloads/nobody-answers-lead-list-template.xlsx",
  csvHref: "/downloads/nobody-answers-lead-list-template.csv",
};

export const STALE_AFTER_MONTHS = 6;

/** Parses "YYYY-MM" to a whole-month count. */
function monthIndex(yyyyMm: string): number {
  const m = /^(\d{4})-(\d{2})$/.exec(yyyyMm);
  if (!m) throw new Error(`Bad lastChecked value: ${yyyyMm} (want YYYY-MM)`);
  const month = Number(m[2]);
  if (month < 1 || month > 12) throw new Error(`Bad month in lastChecked: ${yyyyMm}`);
  return Number(m[1]) * 12 + (month - 1);
}

/**
 * Spec rule 3: a section not checked in six months shows "May be out of date"
 * until it is. Checked in May, it goes stale in November.
 */
export function isStale(lastChecked: string, now: Date = new Date()): boolean {
  const nowIndex = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return nowIndex - monthIndex(lastChecked) >= STALE_AFTER_MONTHS;
}

/** "2026-11" → "November 2026" */
export function formatMonthYear(yyyyMm: string): string {
  const idx = monthIndex(yyyyMm);
  const d = new Date(Date.UTC(Math.floor(idx / 12), idx % 12, 1));
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** Whether a section may show its content publicly. */
export function isPublishable(s: BookSection): boolean {
  if (s.status !== "ready") return false;
  if (s.needsLegalReview && !s.legalReviewedOn) return false;
  return Boolean(s.lastChecked);
}

/**
 * Where each assistant keeps standing instructions (House rules section).
 *
 * Every entry is taken from the vendor's own help doc, read on `checkedOn`.
 * Re-read `sourceUrl` at each quarterly check; menus move. An assistant whose
 * steps could not be confirmed for business accounts is left OUT rather than
 * guessed (Google Gemini on Workspace accounts, as of 2026-11-28: the help docs
 * don't say whether its account-wide instructions work on work accounts).
 */
export interface AssistantInstructionsLocation {
  assistant: string;
  featureName: string;
  steps: string[];
  /** Per-project alternative, if the vendor has one. */
  perProject?: string;
  note?: string;
  sourceUrl: string;
  checkedOn: string;
}

export const ASSISTANT_INSTRUCTION_LOCATIONS: AssistantInstructionsLocation[] = [
  {
    assistant: "ChatGPT",
    featureName: "Custom Instructions",
    steps: [
      "Open Settings and choose Personalization.",
      "Make sure Enable customization is turned on.",
      "Paste your house rules into the Custom Instructions box.",
    ],
    perProject:
      "Inside a project, project instructions replace your custom instructions for that project only.",
    note: "Business and Enterprise plans allow up to 5,000 characters, plenty for the house rules.",
    sourceUrl: "https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt",
    checkedOn: "2026-11-28",
  },
  {
    assistant: "Claude",
    featureName: "Instructions",
    steps: [
      "Click your initials in the lower left corner and open Settings.",
      "Open Your Claude (called Account in the older layout).",
      "Paste your house rules under Instructions.",
    ],
    perProject: "Each project also has its own instructions, for work you keep separate.",
    note:
      "On Team and Enterprise plans, the account owner can also set organization instructions. If they conflict with yours, the organization's win.",
    sourceUrl:
      "https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features",
    checkedOn: "2026-11-28",
  },
  {
    assistant: "Microsoft 365 Copilot",
    featureName: "Custom instructions",
    steps: [
      "In Copilot Chat, open … Settings and more, then Chat settings.",
      "Choose Personalization, then the Custom instructions tile.",
      "Choose Edit instructions, paste your house rules, and Save instructions.",
    ],
    note:
      "Microsoft labels this a preview and is changing the layout, so your screen may look different. Your company's administrator can turn it off; if the setting is greyed out, ask them.",
    sourceUrl:
      "https://support.microsoft.com/en-us/microsoft-365-copilot/customize-how-microsoft-365-copilot-responds-to-you",
    checkedOn: "2026-11-28",
  },
];

/**
 * Twelve months of long-list topics (Step 9). Each is one of the book's four
 * kinds of useful note, never a pitch. No facts that need checking live here:
 * a topic that would quote a rule, a price or a service belongs in a dated,
 * checked note, not in this list.
 */
export const LONG_LIST_TOPICS: { month: string; topic: string; kind: string }[] = [
  { month: "January", topic: "One folder for the important papers: what to keep in it, and telling one person where it is.", kind: "Papers in one place" },
  { month: "February", topic: "How to find an old policy you're not sure about: where to look at home, and who to ask.", kind: "Finding an old policy" },
  { month: "March", topic: "A spring hello. Ask how the winter went, and nothing else.", kind: "Seasonal hello" },
  { month: "April", topic: "Who's named on what: a reminder to check the names on policies and accounts you already have, after a marriage, a divorce or a death.", kind: "Papers in one place" },
  { month: "May", topic: "What happens in the first week after a family member passes: the first calls, in order.", kind: "When someone passes" },
  { month: "June", topic: "Writing down your wishes: a one-page letter to your family about the service you'd want. Not a legal document, just your words.", kind: "Papers in one place" },
  { month: "July", topic: "A summer hello. Something small and local, if you have it.", kind: "Seasonal hello" },
  { month: "August", topic: "A list of accounts and who to call: the one page that saves a family a month of phone calls.", kind: "Papers in one place" },
  { month: "September", topic: "What the funeral home will ask the family, so nobody is caught off guard at the worst time.", kind: "When someone passes" },
  { month: "October", topic: "Why a family needs several certified copies of a death certificate, and where they come from.", kind: "When someone passes" },
  { month: "November", topic: "A thank-you note at Thanksgiving. No ask.", kind: "Seasonal hello" },
  { month: "December", topic: "Before the holidays: put the folder where the family will be, and tell them where it is.", kind: "Seasonal hello" },
];
