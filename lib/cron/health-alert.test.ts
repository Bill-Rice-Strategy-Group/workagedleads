import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  alertSubject,
  failingChecks,
  reminderChecks,
  shouldSendAlert,
  type HealthCheck,
} from "./health-alert";
import { evaluatePriceIndexAge } from "./price-index-check";

function studyCheck(ageDays: number): HealthCheck {
  const v = evaluatePriceIndexAge(ageDays);
  return { name: "Lead Price Index study", ok: v.ok, reminder: v.reminder, detail: v.detail };
}

const healthyCron: HealthCheck = { name: "GSC trend", ok: true, detail: "Last run 0d ago [ok]" };
const failedCron: HealthCheck = { name: "Marketwatch", ok: false, detail: "Last run failed 0d ago" };

describe("health-check alerting", () => {
  test("an overdue study ALONE does not send the alert (the 2026-11 daily-noise email)", () => {
    // The exact situation that sent "[ALERT] 1 Work Aged Leads cron failing" daily:
    // every cron healthy, study 262 days old.
    const checks = [studyCheck(262), healthyCron];
    assert.equal(shouldSendAlert(checks), false);
    assert.equal(failingChecks(checks).length, 0);
    assert.equal(reminderChecks(checks).length, 1);
  });

  test("a real cron failure still alerts, and the subject counts only real failures", () => {
    const checks = [studyCheck(262), healthyCron, failedCron];
    assert.equal(shouldSendAlert(checks), true);
    assert.equal(alertSubject(checks), "[ALERT] 1 Work Aged Leads cron failing");
    assert.deepEqual(reminderChecks(checks).map((c) => c.name), ["Lead Price Index study"]);
  });

  test("all healthy and the study current: no email, no reminder", () => {
    const checks = [studyCheck(30), healthyCron];
    assert.equal(shouldSendAlert(checks), false);
    assert.equal(reminderChecks(checks).length, 0);
  });

  test("a reminder flag on a failing check does not hide the failure", () => {
    const checks: HealthCheck[] = [{ ...failedCron, reminder: true }];
    assert.equal(shouldSendAlert(checks), true);
    assert.equal(reminderChecks(checks).length, 0);
  });
});
