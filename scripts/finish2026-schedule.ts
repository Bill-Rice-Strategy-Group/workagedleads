/**
 * Test, then schedule, the FINISH2026 month-end discount emails.
 *
 * Three modes, safest first:
 *
 *   npx tsx scripts/finish2026-schedule.ts           dry run — renders, gates, counts, prints the plan
 *   npx tsx scripts/finish2026-schedule.ts --test    sends all three to bill@billricestrategy.com only
 *   npx tsx scripts/finish2026-schedule.ts --apply   schedules the broadcasts to the main list
 *
 * Same shape as scripts/mp-launch-schedule.ts: scheduling in Resend means the
 * exact bytes Bill approved are the bytes that mail, and any send can be
 * cancelled from a phone by deleting the broadcast in the Resend dashboard.
 *
 * WHO: the main list (RESEND_AUDIENCE_ID) — the same consolidated audience the
 * monthly restock offer mails, which holds ALS purchasers, ALS inquiries and
 * site signups. Same From as the restock offer (RESEND_FROM_EMAIL).
 *
 * --apply REFUSES unless
 * - data/campaigns/finish2026.json records `partnerConfirmed` with
 *   `creditsAffiliate: true` and `codeExpires`. The copy promises the code
 *   keeps working (no deadline), so if the partner ever sets an expiry the
 *   record must say so and the copy must be revisited before anything mails;
 * - the audience holds at least 500 mailable contacts (wrong-id guard);
 * - every email passes the issue gate;
 * - broadcasts are not already recorded for this campaign.
 *
 * A send whose time has already passed is skipped, not failed, so the script
 * can still schedule the remaining emails if it is first run late.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { Resend } from "resend";
import type { Finish2026Email } from "../lib/newsletter/finish2026";

/** Loaded inside main() so lib/site-url.ts sees .env.local (see mp-launch-schedule.ts). */
async function loadModules() {
  const campaign = await import("../lib/newsletter/finish2026");
  const gate = await import("../lib/newsletter/issue-gate");
  const resend = await import("../lib/resend");
  const site = await import("../lib/site-url");
  return { ...campaign, ...gate, ...resend, ...site };
}

const CANONICAL_HOST = "workagedleads.com";
const MODE = process.argv.includes("--apply") ? "apply" : process.argv.includes("--test") ? "test" : "dry";
const RECORD = join(process.cwd(), "data", "campaigns", "finish2026.json");
const TEST_TO = "bill@billricestrategy.com";
const SEND_HOUR_UTC = "13:00:00Z"; // 8am Eastern, matching the restock offer
const MIN_EXPECTED_RECIPIENTS = 500;

const KEY = (process.env.RESEND_API_KEY || "").trim();
const AUDIENCE = (process.env.RESEND_AUDIENCE_ID || "").trim();
const FROM = (process.env.RESEND_FROM_EMAIL || "").trim();

const scheduledAt = (e: Finish2026Email) => `${e.label}T${SEND_HOUR_UTC}`;
const broadcastName = (e: Finish2026Email) => `FINISH2026 — ${e.key} — ${e.label}`;

function readRecord(): Record<string, unknown> {
  return existsSync(RECORD) ? JSON.parse(readFileSync(RECORD, "utf8")) : {};
}
function writeRecord(r: Record<string, unknown>) {
  mkdirSync(dirname(RECORD), { recursive: true });
  writeFileSync(RECORD, JSON.stringify(r, null, 2) + "\n");
}

async function main() {
  console.log(`=== ${MODE.toUpperCase()} ===`);
  const m = await loadModules();

  if (new URL(m.SITE_URL).hostname !== CANONICAL_HOST) {
    throw new Error(`Site URL resolved to ${m.SITE_URL}, not https://${CANONICAL_HOST} — refusing to render links to the wrong host.`);
  }
  console.log(`site       ${m.SITE_URL}`);
  console.log(`code       ${m.FINISH2026_CODE} — ${m.FINISH2026_DISCOUNT} off, no expiry`);

  const rendered = m.FINISH2026_EMAILS.map((email) => {
    const html = m.buildFinish2026Html(email, m.SITE_URL);
    return { email, html, gate: m.checkIssueHtml(html) };
  });

  for (const { email, html, gate } of rendered) {
    const past = Date.parse(scheduledAt(email)) <= Date.now();
    console.log(`\n${broadcastName(email)}${past ? "   (time has passed — will be skipped)" : ""}`);
    console.log(`  subject    ${email.subject}`);
    console.log(`  preview    ${email.previewText}`);
    console.log(`  sends at   ${scheduledAt(email)}`);
    console.log(`  size       ${(html.length / 1024).toFixed(1)} KB`);
    console.log(`  gate       ${gate.ok ? "pass" : `BLOCKED — ${gate.reason}`}`);
    for (const w of gate.warnings) console.log(`  warning    ${w}`);
  }
  if (rendered.some((r) => !r.gate.ok)) throw new Error("An email failed the issue gate — nothing sent or scheduled.");

  const record = readRecord();
  const confirmed = record.partnerConfirmed as
    | { codeExpires?: string | null; creditsAffiliate?: boolean; by?: string; at?: string }
    | undefined;
  console.log(
    `\npartner    ${confirmed ? `confirmed by ${confirmed.by ?? "?"} on ${confirmed.at ?? "?"}, expires: ${confirmed.codeExpires ?? "never"}, credits us: ${confirmed.creditsAffiliate}` : "NOT CONFIRMED — see data/campaigns/finish2026.json"}`,
  );

  if (MODE === "dry") {
    if (KEY && AUDIENCE) {
      const contacts = await m.fetchAudienceContacts(KEY, AUDIENCE);
      console.log(`audience   ${contacts.filter((c) => !c.unsubscribed).length} mailable of ${contacts.length}`);
    } else {
      console.log("audience   (RESEND_API_KEY / RESEND_AUDIENCE_ID not set — not counted)");
    }
    console.log("\nnothing sent.");
    return;
  }

  if (!KEY) throw new Error("RESEND_API_KEY missing");
  if (!FROM) throw new Error("RESEND_FROM_EMAIL missing");

  if (MODE === "test") {
    const resend = new Resend(KEY);
    for (const { email, html } of rendered) {
      const banner = `<div style="background:#fefce8;border:2px solid #f59e0b;border-radius:8px;padding:12px 16px;margin:0 auto 16px;max-width:600px;font-family:-apple-system,sans-serif;font-size:13px;color:#78350f;">TEST — ${broadcastName(email)}. Would mail ${scheduledAt(email)} to the main list once approved. The unsubscribe link only works in the real broadcast.</div>`;
      const { error } = await resend.emails.send({
        from: FROM,
        replyTo: m.REPLY_TO_EMAIL,
        to: TEST_TO,
        subject: `[TEST] ${email.subject}`,
        html: banner + html,
      });
      if (error) throw new Error(`Test send failed for ${email.key}: ${JSON.stringify(error)}`);
      console.log(`test sent: ${email.key} -> ${TEST_TO}`);
    }
    return;
  }

  // ─── apply ───
  if (!confirmed || confirmed.creditsAffiliate !== true || (confirmed.codeExpires ?? null) !== null) {
    throw new Error(
      `Partner terms not confirmed as the copy assumes. The emails say nothing about expiry and rely on ` +
        `FINISH2026 orders crediting our affiliate account. Record partnerConfirmed: ` +
        `{ "codeExpires": null, "creditsAffiliate": true, "by": "Bill", "at": "<date>" } in ${RECORD}. ` +
        `If the code now has an end date, revisit the copy before scheduling.`,
    );
  }
  if (!AUDIENCE) throw new Error("RESEND_AUDIENCE_ID missing");
  if (record.broadcasts) {
    throw new Error(
      "Broadcasts are already recorded for this campaign — refusing to schedule twice. " +
        "If they were deleted in Resend on purpose, remove the `broadcasts` key from the record first.",
    );
  }

  const contacts = await m.fetchAudienceContacts(KEY, AUDIENCE);
  const mailable = contacts.filter((c) => !c.unsubscribed).length;
  console.log(`audience   ${AUDIENCE}: ${mailable} mailable`);
  if (mailable < MIN_EXPECTED_RECIPIENTS) {
    throw new Error(`Only ${mailable} mailable contacts, below the ${MIN_EXPECTED_RECIPIENTS} floor — the audience id is probably wrong.`);
  }

  const results: Record<string, unknown>[] = [];
  for (const { email, html } of rendered) {
    if (Date.parse(scheduledAt(email)) <= Date.now()) {
      console.log(`skipped ${email.key}: ${scheduledAt(email)} has passed`);
      results.push({ key: email.key, skipped: "time passed before scheduling" });
      continue;
    }
    const { broadcastId } = await m.createScheduledBroadcast(KEY, {
      segmentId: AUDIENCE,
      from: FROM,
      replyTo: m.REPLY_TO_EMAIL,
      subject: email.subject,
      previewText: email.previewText,
      html,
      name: broadcastName(email),
      scheduledAt: scheduledAt(email),
    });
    const back = await m.getBroadcast(KEY, broadcastId);
    const okStatus = back.status === "scheduled";
    const okTime = back.scheduled_at ? Date.parse(back.scheduled_at) === Date.parse(scheduledAt(email)) : false;
    const backSegment = back.segment_id ?? back.audience_id;
    const okSegment = backSegment === AUDIENCE;
    results.push({
      key: email.key,
      broadcastId,
      name: broadcastName(email),
      scheduledAt: scheduledAt(email),
      verified: { status: back.status, scheduled_at: back.scheduled_at, segment: backSegment },
    });
    console.log(`scheduled ${email.key}: ${broadcastId} — status=${back.status} time=${okTime ? "ok" : back.scheduled_at} segment=${okSegment ? "ok" : backSegment}`);
    if (!okStatus || !okTime || !okSegment) {
      writeRecord({ ...readRecord(), broadcasts: results });
      throw new Error(`Broadcast ${broadcastId} did not verify. Check it in the Resend dashboard before anything else.`);
    }
  }

  writeRecord({ ...readRecord(), audienceId: AUDIENCE, mailableAtSchedule: mailable, broadcasts: results, scheduledAtRun: new Date().toISOString() });
  console.log(`\nscheduled and verified. Record: ${RECORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
