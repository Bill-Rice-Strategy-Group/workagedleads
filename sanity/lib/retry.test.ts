import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isTransientError, withRetry, type RetryOptions } from "./retry";

const fast: RetryOptions = { attempts: 3, timeoutMs: 1_000, baseDelayMs: 1, sleep: async () => {} };

function fetchFailed(cause: object): Error {
  const err = new TypeError("fetch failed");
  (err as Error & { cause: object }).cause = cause;
  return err;
}

describe("isTransientError", () => {
  test("matches the shapes Vercel logged for workagedleads", () => {
    // write ETIMEDOUT, connect ETIMEDOUT and a TLS reset, all under `fetch failed`
    assert.equal(isTransientError(fetchFailed({ code: "ETIMEDOUT", syscall: "write" })), true);
    assert.equal(isTransientError(fetchFailed({ code: "ECONNRESET" })), true);
    assert.equal(isTransientError(fetchFailed(new Error("socket disconnected"))), true);
  });

  test("matches our own per-attempt timeout and retryable HTTP statuses", () => {
    const timeout = new Error("timed out");
    timeout.name = "TimeoutError";
    assert.equal(isTransientError(timeout), true);
    assert.equal(isTransientError(Object.assign(new Error("busy"), { statusCode: 503 })), true);
  });

  test("does not match query or auth errors", () => {
    assert.equal(isTransientError(Object.assign(new Error("bad query"), { statusCode: 400 })), false);
    assert.equal(isTransientError(Object.assign(new Error("unauthorized"), { statusCode: 401 })), false);
    assert.equal(isTransientError(new TypeError("x is not a function")), false);
    assert.equal(isTransientError(null), false);
  });
});

describe("withRetry", () => {
  test("returns after a transient failure", async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      if (calls === 1) throw fetchFailed({ code: "ECONNRESET" });
      return "ok";
    }, fast);
    assert.equal(result, "ok");
    assert.equal(calls, 2);
  });

  test("rethrows after the last attempt instead of returning null", async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        throw fetchFailed({ code: "ETIMEDOUT" });
      }, fast),
      /fetch failed/
    );
    assert.equal(calls, 3);
  });

  test("does not retry a non-transient error", async () => {
    let calls = 0;
    await assert.rejects(
      withRetry(async () => {
        calls++;
        throw Object.assign(new Error("bad query"), { statusCode: 400 });
      }, fast),
      /bad query/
    );
    assert.equal(calls, 1);
  });

  test("gives each attempt its own signal that aborts on timeout", async () => {
    const signals: AbortSignal[] = [];
    await assert.rejects(
      withRetry(
        (signal) => {
          signals.push(signal);
          // AbortSignal.timeout doesn't hold the event loop open; a real
          // request's socket does. Hold it here so the timeout can fire.
          const keepAlive = setTimeout(() => {}, 1_000);
          return new Promise((_, reject) =>
            signal.addEventListener("abort", () => {
              clearTimeout(keepAlive);
              reject(signal.reason);
            })
          );
        },
        { ...fast, attempts: 2, timeoutMs: 20 }
      )
    );
    assert.equal(signals.length, 2);
    assert.notEqual(signals[0], signals[1]);
    assert.ok(signals.every((s) => s.aborted));
  });
});
