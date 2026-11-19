import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { senderAddressHtml } from "@/lib/sender";
import { affiliateUrl } from "@/lib/affiliate";

/**
 * One-off list email: "You didn't buy leads. You bought a database."
 *
 * WHY (Bill, 2026-11-18)
 *
 * Follow-up to the 2026-12-01 newsletter, which features the same article
 * (/blog/aged-leads-customer-database-ai-assistant). Bill reviewed the copy in
 * a Claude Doc and chose Thu 2026-12-03 for the send.
 *
 * Plain, personal letter, not the newsletter template: one article link, one
 * store link. Copy rules, same as every other send:
 * - No per-lead prices. "About a dollar a name" is Bill's approved
 *   generalisation, not a price quote; issue-gate.ts still scans the HTML.
 * - No first-person buying claims. No deadline or scarcity.
 * - Solicits replies via the P.S. ON PURPOSE: Bill asked for it back on
 *   2026-11-19, overriding the default in lib/resend.ts. Replies route to
 *   REPLY_TO_EMAIL, which Bill reads.
 * - No texting / autodialing advice: Mode A framing, as in the article.
 */

export const AGED_LEADS_DB_CAMPAIGN = "aged-leads-database";
export const AGED_LEADS_DB_SLUG = "aged-leads-customer-database-ai-assistant";

export const AGED_LEADS_DB_EMAIL = {
  label: "2026-12-03",
  subject: "You didn't buy leads. You bought a database.",
  previewText: "How to work aged leads like past clients, with a little help from AI.",
  body: [
    `I get the same email a few times a month: "I bought aged leads, called them for two weeks, and they don't work."`,
    "They're expecting aged leads to act like fresh leads. They won't. These people asked about a product like yours months ago, and their consent went to the company that collected the lead, not to you. So no texting, and no autodialer.",
    "I've always thought of aged leads as something else: a customer database you can buy for about a dollar a name. You work it the way you'd work your past clients. You send a personal note, send something useful once a month, and call the people who write back.",
    "The hard part used to be time. Nobody can write a thousand personal emails.",
    "That changed this year. A $20 Claude or ChatGPT plan can now connect to your Google Sheet and your Gmail. You give it a short job description, like you would a sales assistant. It sorts your list into groups and writes each person a short, personal email. You approve every one before it goes out. Add a free booking link, and people can pick a time to talk that suits them.",
    "This isn't a volume play. Send about 25 a day, the pace you'd keep by hand. The AI does the boring part. You take the calls.",
    "I wrote up the whole setup step by step, for people who aren't technical. It includes the job description to paste in and a 15-minute morning routine:",
  ],
  ps: "P.S. Hit reply and tell me how you're working your aged leads right now. I read every one.",
} as const;

export function articleUrl(siteUrl: string): string {
  const p = new URLSearchParams({
    utm_source: "newsletter",
    utm_medium: "email",
    utm_campaign: AGED_LEADS_DB_CAMPAIGN,
    utm_content: `${AGED_LEADS_DB_EMAIL.label}-article`,
  });
  return `${siteUrl}/blog/${AGED_LEADS_DB_SLUG}?${p.toString()}`;
}

export function storeLinkUrl(): string {
  return affiliateUrl({
    path: "/all-lead-types/",
    campaign: `email-${AGED_LEADS_DB_CAMPAIGN}`,
    content: `${AGED_LEADS_DB_EMAIL.label}-store`,
  });
}

const P = `margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;`;

export function buildAgedLeadsDbHtml(siteUrl: string): string {
  const e = AGED_LEADS_DB_EMAIL;
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
              <p style="${P} font-weight: 600;"><a href="${articleUrl(siteUrl)}" style="color: #2563eb; text-decoration: underline;">Read: Aged Leads Aren't Leads. They're a Customer Database.</a></p>
              <p style="${P}">And if your database needs filling, <a href="${storeLinkUrl()}" style="color: #2563eb; text-decoration: underline;">Aged Lead Store</a> sells aged mortgage, insurance and home improvement leads in batches small enough to start with. (We earn a commission if you buy.)</p>
              <p style="margin: 8px 0 16px 0; color: #111827; font-size: 16px; line-height: 1.7;">Talk soon,<br>Bill</p>
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 15px; line-height: 1.7;">${e.ps}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving Aged Leads Insights — practical coaching on working aged leads — published by Bill Rice. Links to Aged Lead Store are affiliate links.
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
