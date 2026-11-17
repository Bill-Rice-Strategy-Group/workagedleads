import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { senderAddressHtml } from "@/lib/sender";
import { STORE_VERTICALS, storeUrl, catalogueUrl } from "./store-links";

/**
 * FINISH2026 — a month-end discount push, November 2026.
 *
 * WHY (Bill, 2026-11-17)
 *
 * Commission was ~$280 against a $2,000 monthly target with 13 days left.
 * Troy gave us a 30%-off code, FINISH2026. Closing a $1,720 commission gap at
 * the 16% effective rate (20% rev share × 80% realisation, lib/reports/
 * store-revenue.ts) means ~$10,750 of attributed revenue in two weeks — which
 * only the people who already buy can produce. Store-side GA4, Aug 1 – Sep 10:
 * cold affiliate traffic earned ~$5 a session, returning buyers ~$114. So this
 * campaign goes to the list, not to the blog.
 *
 * THE ANGLE: STOCK Q1 NOW
 *
 * With a discount, every order pays 30% less commission. The code only helps
 * if it pulls buying forward and makes orders bigger. So the argument is not
 * "it's cheaper" — it is "January is when every pipeline gets rebuilt; buy the
 * January restock now, at 30% off, and start the year with it in hand."
 *
 * NO DEADLINE — THE CODE DOES NOT EXPIRE
 *
 * Bill confirmed with Aged Lead Store on 2026-11-17 that FINISH2026 has no end
 * date and that orders using it credit our affiliate account. So no email may
 * say or imply the code expires: no "ends Monday", no "last day", no "through
 * November 30". The month-end deadline is OUR target, not the reader's, and
 * borrowing it as theirs would be invented urgency. The pull is the real one:
 * January restarts every pipeline, and leads bought now are in hand for it.
 * Tests enforce this.
 *
 * DELIBERATELY ABSENT — same rules as every other send
 *
 * - **No prices.** A percentage off is not a per-lead price; the storefront
 *   shows the live number. `issue-gate.ts` still scans every email.
 * - **No first-person buying claims.** Bill is not a current lead buyer.
 * - **No narrating the sequence.** No "as I mentioned Wednesday".
 * - **No paragraph-length affiliate confession.** One clause, beside the links.
 */

export const FINISH2026_CAMPAIGN = "finish2026";
export const FINISH2026_CODE = "FINISH2026";
export const FINISH2026_DISCOUNT = "30%";
/**
 * Last day the SITE promo bar shows (inclusive). This is a campaign window we
 * chose, not a code expiry — the code itself does not expire. Extend or
 * shorten freely; nothing in the copy depends on it.
 */
export const FINISH2026_PROMO_UNTIL = "2026-12-31";

export type Finish2026Key = "launch" | "black-friday" | "december";

export interface Finish2026Email {
  /** Send date, YYYY-MM-DD. Rides in every utm_content. */
  label: string;
  key: Finish2026Key;
  subject: string;
  previewText: string;
  headline: string;
  subhead: string;
  body: string[];
}

export const FINISH2026_LAUNCH: Finish2026Email = {
  label: "2026-11-18",
  key: "launch",
  subject: `${FINISH2026_DISCOUNT} off aged leads with code ${FINISH2026_CODE}`,
  previewText: "Stock your January pipeline now, for less.",
  headline: `${FINISH2026_DISCOUNT} off aged leads`,
  subhead: "Stock your January pipeline now, for less.",
  body: [
    "January is when every sales team resets its goals. The agents and loan officers who hit theirs walk into the first week of the year with a pipeline already loaded, not one they start ordering in week two.",
    `Aged Lead Store is taking ${FINISH2026_DISCOUNT} off with the code above. That is the leads you were going to work in January anyway, bought for less.`,
    `Aged leads earn their keep when you buy them consistently, not once. At ${FINISH2026_DISCOUNT} off, two months of leads costs less than a month and a half usually would.`,
  ],
};

export const FINISH2026_BLACK_FRIDAY: Finish2026Email = {
  label: "2026-11-27",
  key: "black-friday",
  subject: "The one Black Friday buy that pays you back in January",
  previewText: `${FINISH2026_DISCOUNT} off aged leads with code ${FINISH2026_CODE}.`,
  headline: "A Black Friday buy that pays you back",
  subhead: "Your January restock, bought before the year closes.",
  body: [
    "Most of what is on sale this weekend will be forgotten by Christmas. A pipeline you can start calling on January 2 will not.",
    `The code ${FINISH2026_CODE} takes ${FINISH2026_DISCOUNT} off at Aged Lead Store. Pick your vertical below and the storefront shows what is in stock and the live price.`,
  ],
};

export const FINISH2026_DECEMBER: Finish2026Email = {
  label: "2026-11-30",
  key: "december",
  subject: "December goes fast. January's leads don't have to wait.",
  previewText: `Order now, start calling January 2. ${FINISH2026_DISCOUNT} off with ${FINISH2026_CODE}.`,
  headline: "Have January's leads waiting for you",
  subhead: "December disappears into the holidays. Your pipeline doesn't have to.",
  body: [
    "December is short. Between the holidays and the end-of-year scramble, most people put off ordering leads until they are back in January, and then lose the first week or two waiting on them.",
    `Order now and they are in your CRM when you get back. The code ${FINISH2026_CODE} still takes ${FINISH2026_DISCOUNT} off at Aged Lead Store.`,
  ],
};

export const FINISH2026_EMAILS: Finish2026Email[] = [
  FINISH2026_LAUNCH,
  FINISH2026_BLACK_FRIDAY,
  FINISH2026_DECEMBER,
];

function codeBlock(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="border: 2px dashed #2563eb; border-radius: 10px; background-color: #eff6ff; padding: 18px 16px;">
                    <p style="margin: 0 0 4px 0; color: #1e3a5f; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;">Use code at checkout</p>
                    <p style="margin: 0 0 4px 0; color: #111827; font-size: 28px; font-weight: 800; letter-spacing: 0.08em; font-family: 'SFMono-Regular', Menlo, Consolas, monospace;">${FINISH2026_CODE}</p>
                    <p style="margin: 0; color: #374151; font-size: 14px;">${FINISH2026_DISCOUNT} off at Aged Lead Store</p>
                  </td>
                </tr>
              </table>`;
}

/**
 * @param email   Which email, from FINISH2026_EMAILS.
 * @param siteUrl Absolute site origin from lib/site-url.ts. Never hardcode.
 */
export function buildFinish2026Html(email: Finish2026Email, siteUrl: string): string {
  const tag = (placement: string) => `${email.key}-${placement}`;

  const paragraphs = email.body
    .map(
      (text) =>
        `<p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">${text}</p>`,
    )
    .join("\n              ");

  const verticalButtons = STORE_VERTICALS.map(
    (v) => `
                <tr>
                  <td style="padding: 0 0 10px 0;">
                    <a href="${storeUrl(email.label, tag(`vertical-${v.key}`), v.segment, FINISH2026_CAMPAIGN)}"
                       style="display: block; padding: 14px 20px; background-color: #ffffff; border: 1px solid #d4d4d8; border-radius: 8px; color: #18181b; text-decoration: none; font-size: 16px; font-weight: 600;">
                      ${v.label} <span style="color: #2563eb; font-weight: 500;">&rarr;</span>
                    </a>
                  </td>
                </tr>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${email.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${email.previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">${email.headline}</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${email.subhead}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 8px;">
              ${codeBlock()}
              ${paragraphs}
              <p style="margin: 8px 0 20px 0; color: #111827; font-size: 16px; line-height: 1.7; font-weight: 600;">Pick your vertical, then enter ${FINISH2026_CODE} at checkout:</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${verticalButtons}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 32px 8px;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">Not listed? <a href="${catalogueUrl(email.label, tag("catalogue"), FINISH2026_CAMPAIGN)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Browse the full catalogue</a>. <span style="color: #9ca3af;">Affiliate links — we may earn a commission at no cost to you.</span></p>
              <p style="margin: 0 0 4px 0; color: #111827; font-weight: 600; font-size: 16px;">— Bill Rice</p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                <a href="${siteUrl}" style="color: #1e40af; text-decoration: none; font-weight: 600;">Work Aged Leads</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/playbook" style="color: #6b7280; text-decoration: none;">Playbook</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/calculators" style="color: #6b7280; text-decoration: none;">Calculators</a>
              </p>
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving Aged Leads Insights — practical coaching on working aged leads — published by Bill Rice. Links to Aged Lead Store are affiliate links.
              </p>
              ${senderAddressHtml()}
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">${email.label}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Should the site promo bar show at this instant? Closes at the end of
 * FINISH2026_PROMO_UNTIL in US Eastern (05:00 UTC the next day). The bar then
 * removes itself without a deploy.
 */
export function finish2026Active(now: Date = new Date()): boolean {
  const end = new Date(`${FINISH2026_PROMO_UNTIL}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  end.setUTCHours(5);
  return now.getTime() < end.getTime();
}
