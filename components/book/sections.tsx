import Link from "next/link";
import type { ReactNode } from "react";
import { CopyBlock } from "@/components/book/copy-block";
import {
  ASSISTANT_INSTRUCTION_LOCATIONS,
  LONG_LIST_TOPICS,
  NEVER_LIST,
  NEVER_LIST_STATUS_TABLE_REVIEWED,
  SPREADSHEET_TEMPLATE,
} from "@/data/book-guide";

/*
 * Content for each `ready` section of /book/nobody-answers, keyed by section id.
 *
 * Text in a CopyBlock that the appendix also prints is copied from it word for
 * word (chapters/14-appendix-back-office-setup.md in the aged-lead-book repo).
 * Change it here only if the book changes.
 */

const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
);
const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 mt-8 text-lg font-semibold text-zinc-900 dark:text-white">{children}</h3>
);
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="font-medium text-blue-700 underline hover:text-blue-800 dark:text-blue-400">
    {children}
  </Link>
);
const Check = ({ children }: { children: ReactNode }) => (
  <div className="my-5 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
      What you check
    </p>
    <div className="leading-relaxed text-zinc-800 dark:text-zinc-200">{children}</div>
  </div>
);
const NoTech = ({ children }: { children: ReactNode }) => (
  <P>
    <strong>No-tech:</strong> {children}
  </P>
);

const HOUSE_RULES = `I'm [your name], an independent life insurance agent in [your town]. I help families with final expense and life coverage. I work aged leads: people who asked for information weeks or months ago.

When you write for me, write the way I talk: short sentences, plain words, warm and direct. No sales language, no exclamation points, no pressure. Use the person's first name.

You draft. I read and send. Never send anything yourself. Never write as if I've already spoken to someone when I haven't, and never promise anything I didn't promise.

Never suggest texting someone unless my list shows they gave me permission. Never suggest robocalls, AI voices or mass messages.

If you're not sure about a name, a date or a fact, say so instead of guessing.

When I correct you, treat the correction as a rule from then on.`;

const STEP1_COLUMNS: [string, string][] = [
  ["Name", "First and last"],
  ["Email", ""],
  ["Phone", ""],
  ["Town", "And roughly how far from you, so you know whether to offer video"],
  ["Date they asked", "The date on the lead form"],
  ["What they asked about", "In their words, if the form has them"],
  ["Batch and cost", "Which purchase they came from, and what you paid per name"],
  ["Status", "One of: never called, tried, talked, wrote a policy, long list, do not contact"],
  ["Last contact", "Date and how"],
  ["Next step", "What you promised, and when"],
  ["Text permission", "Blank, or the date, how they said yes, and where the proof is saved"],
  ["Notes", "Short. The after-call notes (Step 5) hold the detail"],
];

function NeverList() {
  return (
    <>
      <P>
        Before you set up anything, write the never list down and hang it where you can see it.
        Everything else on this page sits inside it. This is the list exactly as the book prints
        it.
      </P>
      <blockquote className="my-6 rounded-xl border-2 border-zinc-900 p-6 dark:border-zinc-200">
        <p className="mb-3 font-bold text-zinc-900 dark:text-white">{NEVER_LIST.lead}</p>
        <ol className="list-decimal space-y-2 pl-6 text-zinc-800 dark:text-zinc-200">
          {NEVER_LIST.lines.map((l) => (
            <li key={l.bold}>
              <strong>{l.bold}</strong>
              {l.rest}
            </li>
          ))}
        </ol>
        <p className="mt-3 italic text-zinc-800 dark:text-zinc-200">{NEVER_LIST.sixth}</p>
      </blockquote>
      <P>Two more, from the email rules in Chapter 4:</P>
      <ul className="mb-4 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
        <li>
          <strong>{NEVER_LIST.fromChapter4[0]}</strong> and write it down.
        </li>
        <li>
          <strong>{NEVER_LIST.fromChapter4[1]}</strong>
        </li>
      </ul>
      {!NEVER_LIST_STATUS_TABLE_REVIEWED && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <strong>Coming:</strong> the current legal status of each line, with dates. It goes up
          once our lawyers have reviewed it. Until then, the book&apos;s advice stands: the rules on
          calls, texts and AI change often and differ by state, so spend thirty minutes with a
          lawyer who does this for a living before you build a campaign.
        </div>
      )}
    </>
  );
}

function BuildTheList() {
  return (
    <>
      <P>
        Every lead you&apos;ve bought goes in one spreadsheet, one person per row. Start from the
        template: it has the twelve columns from the book, the six status values as a drop-down, a{" "}
        <em>Today</em> tab and a monthly numbers tab.
      </P>
      <div className="my-6 flex flex-wrap gap-3 print:hidden">
        <a
          href={SPREADSHEET_TEMPLATE.href}
          download
          className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Download the template (.xlsx)
        </a>
        <a
          href={SPREADSHEET_TEMPLATE.csvHref}
          download
          className="rounded-lg border border-zinc-300 px-5 py-3 font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Just the columns (.csv)
        </a>
      </div>
      <P>
        The .xlsx opens in Excel, and in Google Sheets or Numbers if you upload or open it there.
        Free, no sign-up.
      </P>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-300 dark:border-zinc-700">
              <th className="py-2 pr-4 font-semibold text-zinc-900 dark:text-white">Column</th>
              <th className="py-2 font-semibold text-zinc-900 dark:text-white">What goes in it</th>
            </tr>
          </thead>
          <tbody>
            {STEP1_COLUMNS.map(([c, d]) => (
              <tr key={c} className="border-b border-zinc-100 align-top dark:border-zinc-800">
                <td className="py-2 pr-4 font-medium text-zinc-900 dark:text-white">{c}</td>
                <td className="py-2 text-zinc-700 dark:text-zinc-300">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NoTech>
        a recipe box of index cards, one card per person, with the same headings.
      </NoTech>
      <H3>With the assistant</H3>
      <CopyBlock
        label="Ask for this"
        text="Merge these lead files into one sheet with these columns: Name, Email, Phone, Town, Date they asked, What they asked about, Batch and cost, Status, Last contact, Next step, Text permission, Notes. Find the duplicates, and flag anyone who appears in more than one batch. Don't delete anything; show me what you'd merge."
      />
      <Check>
        Look at what it did. Check a dozen rows against the original files before you trust the
        rest. And never put Social Security numbers, bank account or card numbers, or policy
        numbers in any assistant.
      </Check>
      <H3>Your five numbers</H3>
      <P>
        From Chapter 2: cost per lead, contact rate, contact-to-close rate, average revenue per
        close, and cost per close. A pencil is fine. The template&apos;s <em>Monthly numbers</em>{" "}
        tab works them out for you; its first row is Hank&apos;s numbers from the book, so you can
        see it give the same answers (about $1.05 a name and $143 a policy).
      </P>
      <P>
        Or use the calculators on this site: <A href="/calculators/know-your-cpl">Know your cost
        per lead</A> and the <A href="/calculators/roi-calculator">ROI calculator</A>.
      </P>
    </>
  );
}

function HouseRules() {
  return (
    <>
      <P>
        The most useful ten minutes in the whole setup. Write your standing instructions once and
        the assistant follows them in every conversation. Here&apos;s the book&apos;s version to
        start from. Change it until it sounds like you.
      </P>
      <CopyBlock label="House rules: copy, then fill in the brackets" text={HOUSE_RULES} />
      <P>
        <strong>Every mistake you fix becomes a rule</strong> (Chapter 6). When it calls Walt
        &ldquo;Walter,&rdquo; tell it, and if it happens twice, add the fix to the end of your house
        rules: <em>&ldquo;Use the name exactly as it appears in my list. Never lengthen a
        nickname.&rdquo;</em> After a month, the drafts need far less fixing.
      </P>
      <H3>Where to put them</H3>
      <P>
        These steps come from each company&apos;s own help pages. Menus move, so if yours looks
        different, follow the link to the current help page.
      </P>
      <div className="space-y-4">
        {ASSISTANT_INSTRUCTION_LOCATIONS.map((a) => (
          <div key={a.assistant} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="font-semibold text-zinc-900 dark:text-white">
              {a.assistant}{" "}
              <span className="font-normal text-zinc-500">· called &ldquo;{a.featureName}&rdquo;</span>
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {a.perProject && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{a.perProject}</p>}
            {a.note && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{a.note}</p>}
            <p className="mt-2 text-xs text-zinc-500">
              Source:{" "}
              <a href={a.sourceUrl} className="underline" rel="noopener" target="_blank">
                {a.assistant} help page
              </a>
              , checked{" "}
              {new Date(a.checkedOn + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </div>
        ))}
      </div>
      <P>
        <span className="mt-4 block text-sm text-zinc-600 dark:text-zinc-400">
          Using a different assistant? Look in its settings for &ldquo;instructions,&rdquo;
          &ldquo;personalization&rdquo; or &ldquo;preferences.&rdquo; If it has nowhere to save
          them, keep the house rules in a document and paste them at the start of each
          conversation.
        </span>
      </P>
    </>
  );
}

function TodayPage() {
  return (
    <>
      <P>
        One place where everything that needs you lands: drafts to read, promises due, replies to
        answer, flags on applications. What matters is that there&apos;s one, and you clear it.
        When it&apos;s empty, the week is done. Pick whichever of these you&apos;ll actually look at
        every morning.
      </P>
      <H3>1. A tab in your spreadsheet</H3>
      <P>
        The template already has one, called <em>Today</em>, with five columns: date, who, what,
        kind (draft to read, promise due, reply to answer, flag), and done. Best if you live in
        your list anyway. Clear it by deleting the rows you&apos;ve finished, or filter out the
        ones marked done.
      </P>
      <H3>2. A folder in your email</H3>
      <P>
        Make one folder (some email programs call it a label) named <em>Today</em>. Anything that
        needs you goes in it; anything you&apos;ve dealt with comes out. Best if your drafts and
        replies already live in your email. Drafts stay in your drafts folder until you&apos;ve
        read them; put a note in <em>Today</em> that they&apos;re waiting.
      </P>
      <H3>3. A page in your notes</H3>
      <P>
        One page named <em>Today</em>, a checklist, one line per item. Best if you carry your phone
        more than you sit at a desk. Start each week with a fresh page.
      </P>
      <H3>With the assistant</H3>
      <P>Have every draft, reminder and flag go to that one place. Add this to your house rules:</P>
      <CopyBlock
        label="Add to your house rules"
        text="Whenever you draft something for me, set a reminder, or find a problem, also give me a line for my Today page: the date, the person, what it is, and what I need to do. If you can't add it yourself, list the lines at the end of your answer so I can paste them in."
      />
      <Check>
        That everything that needed you actually landed there. If you find a promise or a draft
        somewhere else, it isn&apos;t handed off yet.
      </Check>
      <NoTech>the index cards sorted by day, and you look at them every morning.</NoTech>
    </>
  );
}

function CallBrief() {
  return (
    <>
      <P>
        <strong>Read before you dial. Write before you forget.</strong> That&apos;s the whole
        system (Chapter 6).
      </P>
      <H3>The call brief: one page, one minute, before you dial</H3>
      <CopyBlock
        label="Ask for this"
        text={`Make a call brief for [name] from their row, their lead form and my notes. Who they are and how far away; what they asked for and when; anything they've said since, word for word; what probably matters to them; one sentence on where to start; anything to avoid; and any promise I've already made.`}
      />
      <P>Here is the one Jess printed for Hank, from Chapter 6:</P>
      <div className="my-5 rounded-xl border border-zinc-300 bg-white p-5 text-sm leading-relaxed text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
        <p>
          <strong>Dolores Kincaid</strong> · Spencerville (35 min) · offer video · from the December
          list
        </p>
        <p className="mt-2">
          <strong>Asked:</strong> final expense info, form filled out in August. Coverage amount on
          form: &ldquo;not sure.&rdquo;
        </p>
        <p className="mt-2">
          <strong>Replied to email 2 (Jan 5):</strong>{" "}
          <em>
            &ldquo;My husband passed in the spring and I&apos;m trying to get everything in order. I
            don&apos;t really know what we had. Afternoons are best.&rdquo;
          </em>
        </p>
        <p className="mt-2">
          <strong>What probably matters:</strong> recently widowed; handling the money alone, maybe
          for the first time; may not know what her husband left or didn&apos;t. She asked for
          afternoons.
        </p>
        <p className="mt-2">
          <strong>Start with:</strong> how she&apos;s doing, not the policy.
        </p>
        <p className="mt-2">
          <strong>Don&apos;t:</strong> say &ldquo;you and your husband.&rdquo; Don&apos;t rush.
        </p>
        <p className="mt-2">
          <strong>Open promises:</strong> none yet.
        </p>
      </div>
      <Check>
        The facts, and especially the names. If the brief says something you can&apos;t find in
        your notes, it guessed. Cross it out.
      </Check>

      <H3>The after-call note: sixty seconds, right after you hang up</H3>
      <P>
        Talk it out loud the way you&apos;d tell your spouse about your day: who it was, what they
        said, what matters, what you promised. Then:
      </P>
      <CopyBlock
        label="Ask for this"
        text="Write this up as a note for [name]'s record, and list every promise I made with its date."
      />
      <Check>
        The names, again. Then put each promise on your calendar or your <em>Today</em> page
        before you do anything else.
      </Check>

      <H3>The card</H3>
      <P>
        Prefer paper? <A href="/book/call-brief-card">Print the call-brief card</A>: brief on the
        front, after-call note on the back, four to a sheet.
      </P>
      <NoTech>an index card for each call. Brief on the front, note on the back.</NoTech>
    </>
  );
}

function LongList() {
  return (
    <>
      <P>
        <strong>&ldquo;Not yet&rdquo; isn&apos;t &ldquo;no&rdquo;</strong> (Chapter 10). When the
        two-week series ends with no answer, the name moves to <em>long list</em>, unless they told
        you to stop. Once a month, each person on it gets something useful. Not a pitch.
      </P>
      <H3>Twelve months of topics</H3>
      <P>
        Use them in any order. When something real changes that affects your people, send that
        instead.
      </P>
      <div className="my-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {LONG_LIST_TOPICS.map((t) => (
              <tr key={t.month} className="border-b border-zinc-100 align-top dark:border-zinc-800">
                <td className="w-28 py-2 pr-4 font-semibold text-zinc-900 dark:text-white">{t.month}</td>
                <td className="py-2 text-zinc-700 dark:text-zinc-300">{t.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CopyBlock
        label="Ask for this, once a month"
        text={`Draft this month's long-list note for each person with status long list. One short, personal paragraph each, using what my notes say about them. This month's topic: [topic]. Sign it with my name and include an easy way to reply or say no thanks.`}
      />
      <Check>
        Every one, the same as the email series. And when someone replies from the long list, call
        within a day. That&apos;s the warmest lead you&apos;ll ever get.
      </Check>
      <H3>Your monthly numbers</H3>
      <P>
        Same day each month, update your five numbers and add dials, real conversations, sales on
        video and hours worked. The <em>Monthly numbers</em> tab in the{" "}
        <a href={SPREADSHEET_TEMPLATE.href} download className="font-medium text-blue-700 underline dark:text-blue-400">
          list template
        </a>{" "}
        has a row for each month. Compare them to last month. The assistant runs them; you decide
        what they mean.
      </P>
      <CopyBlock
        label="Ask for this, once a month"
        text="Update my monthly numbers from my list: cost per lead, contact rate, contact-to-close rate, average revenue per close and cost per close, plus dials, real conversations, sales on video and hours worked this month. Put them next to last month's, and show your working so I can check it."
      />
      <NoTech>five handwritten notes or short emails a day, every working day.</NoTech>
    </>
  );
}

export const SECTION_CONTENT: Record<string, () => ReactNode> = {
  "never-list": NeverList,
  "build-the-list": BuildTheList,
  "house-rules": HouseRules,
  "today-page": TodayPage,
  "call-brief": CallBrief,
  "long-list": LongList,
};
