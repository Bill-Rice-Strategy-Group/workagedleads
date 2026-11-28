"use client";

import { useState, type FormEvent } from "react";
import { HoneypotInput } from "@/components/honeypot-input";

/** Optional. The guide is never behind this form. */
export function BookUpdatesSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/book/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (res.ok) {
        setStatus("done");
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
      <p className="font-semibold text-zinc-900 dark:text-white">Email me when this guide changes</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Optional. One short email when a section changes, nothing else. This isn&apos;t the
        newsletter.
      </p>
      {status === "done" ? (
        <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-400">
          Done. You&apos;ll hear from us when something here changes.
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
            {status === "loading" ? "…" : "Email me"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-sm text-red-700">{message}</p>}
    </div>
  );
}
