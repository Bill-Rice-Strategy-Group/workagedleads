import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { senderAddressHtml } from "@/lib/sender";
import { BOOK } from "@/lib/book";

/**
 * One-off list email: launch of Bill's book "Sales Team of One".
 *
 * WHY (Bill, 2026-11-27)
 *
 * Bill asked whether to promote the book in the newsletter. The answer was yes,
 * but as a supporting campaign rather than an equal of the Aged Lead Store
 * offers: commission is behind target and email clicks are scarce, so the book
 * gets one dedicated send plus an occasional P.S., never the main CTA of a
 * store email.
 *
 * APPROVED by Bill 2026-11-27 (copy, date, no store link) and scheduled in
 * Resend — see data/campaigns/book-launch.json. Cancel by deleting the
 * broadcast in the Resend dashboard. scripts/book-launch-schedule.ts --apply
 * refuses while `BOOK_LAUNCH_APPROVED_AT` is null.
 *
 * DATE: Thu 2026-12-17, 8am Eastern. It clears FINISH2026 (ended
 * 11-30), the Tuesday newsletters (12-01, 12-08, 12-15) and the aged-leads
 * database email (Thu 12-10), and lands before the holidays and the January
 * restock push.
 *
 * Plain personal letter, like aged-leads-database-email.ts. ONE link, to /book
 * on our site (not straight to Amazon) so the visit shows in GA4 with UTMs.
 *
 * DELIBERATELY NO STORE LINK. The issue gate will warn "cannot earn anything";
 * that is expected here. Mixing a store pitch into the book letter would weaken
 * both. If Bill wants one anyway, add a single line in the P.S. style of
 * aged-leads-database-email.ts with its own utm_content.
 *
 * Copy rules:
 * - No price (Amazon sets it) and no review count (there are none yet).
 * - Say plainly that the story is about a software founder, then make the
 *   bridge to readers who work leads.
 * - Review ask is honest-review-only, with no incentive (Amazon policy).
 * - No first-person lead-buying claims. No deadline or scarcity.
 */

export const BOOK_LAUNCH_CAMPAIGN = "book-sales-team-of-one";
/** Set to the ISO date Bill approves the copy and send date. */
export const BOOK_LAUNCH_APPROVED_AT: string | null = "2026-11-27";

export const BOOK_LAUNCH_EMAIL = {
  label: "2026-12-17",
  subject: "I wrote a book about selling on your own",
  /** Alternates for Bill to choose from; not used in code. */
  subjectAlternates: [
    "What's left for a solo seller when AI does the follow-up?",
    "Sales Team of One (my new book)",
  ],
  previewText: "What's left for one person selling alone, now that AI can send 2,000 follow-ups before lunch.",
  body: [
    "Most people who read these emails sell on their own. You find the leads, make the calls, run the follow-up, close the deal and do the paperwork. Nobody hands you a marketing department.",
    "I've been thinking for a while about what happens to people who sell like that now that AI can do so much of the work. A machine can write a decent follow-up in seconds and send two thousand of them before lunch. If what you sold was effort, that's a problem.",
    `So I wrote a book about it. It's called <em>${BOOK.title}: ${BOOK.subtitle}</em>.`,
    "It's told as a story. Marcus Reyes is a software founder who has to become his company's whole sales team or watch it fail. Over one year he goes from sending emails nobody answers to a pipeline that comes to him. Each chapter ends with the method underneath the story, so you can use it yourself.",
    "Marcus sells software, not insurance or mortgages. But his problem is the one you have every day: one person, one number, no team. And what he learns works the same way for you. Machines can fake effort. They can't fake someone who really knows their stuff and is curious about the person on the other end of the phone.",
    "There's also a chapter on where AI really helps someone selling alone, and the places where leaning on it costs you the deal.",
    `It's short, about ${BOOK.printLength} pages, and it's on Kindle now:`,
  ],
  linkText: `${BOOK.title}: read more and get it on Kindle`,
  ps: "P.S. If you read it, an honest review on Amazon helps a new book more than you'd think. And if you'd rather just tell me what you thought, hit reply. I read every one.",
} as const;

export function bookPageUrl(siteUrl: string): string {
  const p = new URLSearchParams({
    utm_source: "newsletter",
    utm_medium: "email",
    utm_campaign: BOOK_LAUNCH_CAMPAIGN,
    utm_content: `${BOOK_LAUNCH_EMAIL.label}-book`,
  });
  return `${siteUrl}/book?${p.toString()}`;
}

const P = `margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;`;

export function buildBookLaunchHtml(siteUrl: string): string {
  const e = BOOK_LAUNCH_EMAIL;
  const paragraphs = e.body.map((t) => `<p style="${P}">${t}</p>`).join("\n              ");
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${e.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${e.previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 8px;">
              ${paragraphs}
              <p style="${P} font-weight: 600;"><a href="${bookPageUrl(siteUrl)}" style="color: #2563eb; text-decoration: underline;">${e.linkText}</a></p>
              <p style="margin: 8px 0 16px 0; color: #111827; font-size: 16px; line-height: 1.7;">Talk soon,<br>Bill</p>
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 15px; line-height: 1.7;">${e.ps}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving Aged Leads Insights — practical coaching on working aged leads — published by Bill Rice. ${BOOK.title} is Bill's own book.
              </p>
              ${senderAddressHtml()}
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">${e.label}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
