/**
 * What the daily health check emails about, kept out of the route so it can be
 * tested.
 *
 * A check is one of three things:
 *   - ok                — nothing to say
 *   - reminder          — a human task is due (e.g. the quarterly Lead Price
 *                         Index study). Never a failure, never a reason to email.
 *   - failing (!ok)     — a cron is stale, failed, or never ran. Alerts.
 *
 * The alert email is sent only when at least one check is failing. Reminders
 * appear in that email when it goes out anyway, and otherwise live in
 * BACKLOG.md, which the BRSG portfolio report reads.
 */

export type HealthCheck = {
  name: string;
  ok: boolean;
  /** A due human task. Must only be set on checks that are `ok`. */
  reminder?: boolean;
  detail: string;
  lastSeen?: string;
  ageDays?: number;
};

export function failingChecks(checks: HealthCheck[]): HealthCheck[] {
  return checks.filter((c) => !c.ok);
}

export function reminderChecks(checks: HealthCheck[]): HealthCheck[] {
  return checks.filter((c) => c.ok && c.reminder === true);
}

/** Only a real failure sends the email. A reminder alone never does. */
export function shouldSendAlert(checks: HealthCheck[]): boolean {
  return failingChecks(checks).length > 0;
}

export function alertSubject(checks: HealthCheck[]): string {
  const n = failingChecks(checks).length;
  return `[ALERT] ${n} Work Aged Leads cron${n > 1 ? "s" : ""} failing`;
}
