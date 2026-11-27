/**
 * Test, then schedule, the one-off "Sales Team of One" book launch email
 * (proposed Thu 2026-12-17, 8am Eastern — see lib/newsletter/book-launch-email.ts).
 *
 *   npx tsx scripts/book-launch-schedule.ts           dry run — renders, gates, counts
 *   npx tsx scripts/book-launch-schedule.ts --test    sends to bill@billricestrategy.com only
 *   npx tsx scripts/book-launch-schedule.ts --apply   schedules the broadcast to the main list
 *
 * Same shape and guards as scripts/finish2026-schedule.ts: the exact bytes
 * approved are the bytes that mail, and the send can be cancelled by deleting
 * the broadcast in the Resend dashboard.
 *
 * --apply REFUSES unless BOOK_LAUNCH_APPROVED_AT is set, the email passes the issue gate, the audience holds at
 * least 500 mailable contacts (wrong-id guard), the send time is in the future,
 * and no broadcast is already recorded in data/campaigns/book-launch.json.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { Resend } from "resend";

async function loadModules() {
  const email = await import("../lib/newsletter/book-launch-email");
  const gate = await import("../lib/newsletter/issue-gate");
  const resend = await import("../lib/resend");
  const site = await import("../lib/site-url");
  return { ...email, ...gate, ...resend, ...site };
}

const CANONICAL_HOST = "workagedleads.com";
const MODE = process.argv.includes("--apply") ? "apply" : process.argv.includes("--test") ? "test" : "dry";
const RECORD = join(process.cwd(), "data", "campaigns", "book-launch.json");
const TEST_TO = "bill@billricestrategy.com";
const SEND_HOUR_UTC = "13:00:00Z"; // 8am Eastern, matching the other list sends
const MIN_EXPECTED_RECIPIENTS = 500;

const KEY = (process.env.RESEND_API_KEY || "").trim();
const AUDIENCE = (process.env.RESEND_AUDIENCE_ID || "").trim();
const FROM = (process.env.RESEND_FROM_EMAIL || "").trim();

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
    throw new Error(`Site URL resolved to ${m.SITE_URL}, not https://${CANONICAL_HOST}.`);
  }

  const e = m.BOOK_LAUNCH_EMAIL;
  const scheduledAt = `${e.label}T${SEND_HOUR_UTC}`;
  const name = `Book launch: Sales Team of One — ${e.label}`;
  const html = m.buildBookLaunchHtml(m.SITE_URL);
  const gate = m.checkIssueHtml(html);

  console.log(`${name}`);
  console.log(`  subject    ${e.subject}`);
  console.log(`  preview    ${e.previewText}`);
  console.log(`  sends at   ${scheduledAt}`);
  console.log(`  book page  ${m.bookPageUrl(m.SITE_URL)}`);
  console.log(`  approved   ${m.BOOK_LAUNCH_APPROVED_AT ?? "NO — draft"}`);
  console.log(`  size       ${(html.length / 1024).toFixed(1)} KB`);
  console.log(`  gate       ${gate.ok ? "pass" : `BLOCKED — ${gate.reason}`}`);
  for (const w of gate.warnings) console.log(`  warning    ${w}`);
  if (!gate.ok) throw new Error("Email failed the issue gate — nothing sent or scheduled.");

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
    const banner = `<div style="background:#fefce8;border:2px solid #f59e0b;border-radius:8px;padding:12px 16px;margin:0 auto 16px;max-width:600px;font-family:-apple-system,sans-serif;font-size:13px;color:#78350f;">TEST — ${name}. Would mail ${scheduledAt} to the main list once scheduled. The unsubscribe link only works in the real broadcast.</div>`;
    const { error } = await new Resend(KEY).emails.send({
      from: FROM,
      replyTo: m.REPLY_TO_EMAIL,
      to: TEST_TO,
      subject: `[TEST] ${e.subject}`,
      html: banner + html,
    });
    if (error) throw new Error(`Test send failed: ${JSON.stringify(error)}`);
    console.log(`test sent -> ${TEST_TO}`);
    return;
  }

  // ─── apply ───
  if (!m.BOOK_LAUNCH_APPROVED_AT) {
    throw new Error("BOOK_LAUNCH_APPROVED_AT is null — Bill has not approved this email. Nothing scheduled.");
  }
  if (!AUDIENCE) throw new Error("RESEND_AUDIENCE_ID missing");
  if (Date.parse(scheduledAt) <= Date.now()) throw new Error(`${scheduledAt} has already passed.`);
  const record = readRecord();
  if (record.broadcast) {
    throw new Error(
      "A broadcast is already recorded for this email — refusing to schedule twice. " +
        "If it was deleted in Resend on purpose, remove the `broadcast` key from the record first.",
    );
  }

  const contacts = await m.fetchAudienceContacts(KEY, AUDIENCE);
  const mailable = contacts.filter((c) => !c.unsubscribed).length;
  console.log(`audience   ${AUDIENCE}: ${mailable} mailable`);
  if (mailable < MIN_EXPECTED_RECIPIENTS) {
    throw new Error(`Only ${mailable} mailable contacts, below the ${MIN_EXPECTED_RECIPIENTS} floor — the audience id is probably wrong.`);
  }

  const { broadcastId } = await m.createScheduledBroadcast(KEY, {
    segmentId: AUDIENCE,
    from: FROM,
    replyTo: m.REPLY_TO_EMAIL,
    subject: e.subject,
    previewText: e.previewText,
    html,
    name,
    scheduledAt,
  });
  const back = await m.getBroadcast(KEY, broadcastId);
  const backSegment = back.segment_id ?? back.audience_id;
  const okStatus = back.status === "scheduled";
  const okTime = back.scheduled_at ? Date.parse(back.scheduled_at) === Date.parse(scheduledAt) : false;
  const okSegment = backSegment === AUDIENCE;
  const broadcast = {
    broadcastId,
    name,
    scheduledAt,
    verified: { status: back.status, scheduled_at: back.scheduled_at, segment: backSegment },
  };
  writeRecord({
    ...readRecord(),
    campaign: m.BOOK_LAUNCH_CAMPAIGN,
    approvedBy: "Bill",
    approvedAt: m.BOOK_LAUNCH_APPROVED_AT,
    audienceId: AUDIENCE,
    mailableAtSchedule: mailable,
    broadcast,
    scheduledAtRun: new Date().toISOString(),
  });
  console.log(`scheduled: ${broadcastId} — status=${back.status} time=${okTime ? "ok" : back.scheduled_at} segment=${okSegment ? "ok" : backSegment}`);
  if (!okStatus || !okTime || !okSegment) {
    throw new Error(`Broadcast ${broadcastId} did not verify. Check it in the Resend dashboard.`);
  }
  console.log(`\nscheduled and verified. Record: ${RECORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
