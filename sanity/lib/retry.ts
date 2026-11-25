/**
 * Per-attempt timeout and retry for Sanity reads.
 *
 * Why this exists: with Next's cache options set, @sanity/client goes through
 * Node's built-in fetch. A network failure then surfaces as
 * `TypeError: fetch failed` with the real code (ETIMEDOUT, ECONNRESET) on
 * `err.cause`, which the client's own retry does not treat as retryable, and a
 * hung TCP connect has no deadline of its own. Vercel logged 83 of these on
 * /guides, /blog and /lead-types between Aug and Nov 2026.
 *
 * After the last attempt the error is rethrown on purpose. Returning null would
 * make the page call notFound(), and ISR would cache that 404 over a good page.
 * A thrown error during revalidation keeps the last good page in the cache.
 */

const NETWORK_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "ECONNABORTED",
  "EPIPE",
  "EAI_AGAIN",
  "ENOTFOUND",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET",
]);

/** HTTP statuses worth one more try: rate limiting and upstream hiccups. */
const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);

function codeOf(value: unknown): string | undefined {
  if (value && typeof value === "object" && "code" in value) {
    const code = (value as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

/** True for transient network failures and timeouts, false for query or auth errors. */
export function isTransientError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: string; message?: string; cause?: unknown; statusCode?: number };

  if (e.name === "TimeoutError" || e.name === "AbortError") return true;
  if (typeof e.statusCode === "number" && RETRYABLE_STATUS.has(e.statusCode)) return true;

  const code = codeOf(err) ?? codeOf(e.cause);
  if (code && NETWORK_CODES.has(code)) return true;

  // undici: `TypeError: fetch failed` with the socket error on `cause`. A TLS
  // handshake cut short carries no code, only a message.
  if (e.name === "TypeError" && e.message === "fetch failed") return true;

  return false;
}

export interface RetryOptions {
  /** Total attempts, including the first. */
  attempts: number;
  /** Deadline for each attempt, in ms. */
  timeoutMs: number;
  /** Delay before retry n (1-based) is baseDelayMs * 2^(n-1). */
  baseDelayMs: number;
  /** Injected for tests. */
  sleep?: (ms: number) => Promise<void>;
}

/**
 * 4 attempts, waits of 0.5s / 1s / 2s between them: rides out a Sanity CDN blip
 * of ~3.5s. Tuned 2026-11-25 after #92's 3 attempts at 0.25s / 0.5s still let
 * 13 failures through in a day, all brief resets and timeouts on
 * p7rbtajg.apicdn.sanity.io across four regions. The per-attempt deadline came
 * down from 6s to 4s so the worst case when Sanity is fully down stays about
 * where it was (19.5s against 18.75s); a test pins that budget.
 */
export const SANITY_RETRY: RetryOptions = {
  attempts: 4,
  timeoutMs: 4_000,
  baseDelayMs: 500,
};

/** Longest a single read can take when every attempt times out. */
export function worstCaseMs(o: RetryOptions): number {
  let waits = 0;
  for (let n = 1; n < o.attempts; n++) waits += o.baseDelayMs * 2 ** (n - 1);
  return o.attempts * o.timeoutMs + waits;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Runs `fn` with a fresh AbortSignal per attempt. Retries only transient
 * errors; anything else (bad GROQ, auth) is thrown at once.
 */
export async function withRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options: RetryOptions = SANITY_RETRY
): Promise<T> {
  const sleep = options.sleep ?? defaultSleep;
  let lastError: unknown;
  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      return await fn(AbortSignal.timeout(options.timeoutMs));
    } catch (err) {
      lastError = err;
      if (attempt === options.attempts || !isTransientError(err)) throw err;
      await sleep(options.baseDelayMs * 2 ** (attempt - 1));
    }
  }
  throw lastError;
}
