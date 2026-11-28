"use client";

import { useState, type FormEvent } from "react";
import { HoneypotInput } from "@/components/honeypot-input";
import { trackNewsletterSignup } from "@/components/analytics";

/**
 * Optional signup at the foot of the Nobody Answers guide. The guide is never
 * behind it.
 *
 * ONE LIST (Bill, 2026-11-28): this posts to the site's normal newsletter
 * signup, /api/newsletter, which adds the reader to the main Work Aged Leads
 * Resend audience and sends the usual welcome email. Guide changes are
 * announced to that list. The copy says plainly that this is the newsletter,
 * because that's what the reader is joining.
 */
export function BookUpdatesSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (res.ok) {
        setStatus("done");
        trackNewsletterSignup("book-guide", email);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 print:hidden dark:border-zinc-800 dark:bg-zinc-900">
      <p className="font-semibold text-zinc-900 dark:text-white">Hear when this guide changes</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Optional. Join the Work Aged Leads newsletter and you&apos;ll hear there when a section of
        this guide changes, along with the weekly scripts and ideas. Unsubscribe anytime.
      </p>
      {status === "done" ? (
        <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-400">
          You&apos;re in. Check your email for a welcome message.
        </p>
      ) : (
        <form onSubmit={submit} className="relative mt-3 flex flex-col gap-2 sm:flex-row">
          <HoneypotInput value={website} onChange={setWebsite} />
          <label htmlFor="book-updates-email" className="sr-only">
            Email address
          </label>
          <input
            id="book-updates-email"
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Sign me up"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-sm text-red-700">{message}</p>}
    </div>
  );
}
