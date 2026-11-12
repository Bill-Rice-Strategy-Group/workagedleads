"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trackNewsletterSignup, trackCtaClick, trackLead } from "@/components/analytics";
import { HoneypotInput } from "@/components/honeypot-input";
import type { Vertical } from "@/lib/email-course/types";

interface FlagshipSignupFormProps {
  vertical: Vertical;
  verticalTitle: string;
  context?: string;
}

export function FlagshipSignupForm({
  vertical,
  verticalTitle,
  context = "flagship-landing",
}: FlagshipSignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/flagship/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          vertical,
          firstName: firstName.trim() || undefined,
          website,
        }),
      });

      if (res.ok) {
        trackNewsletterSignup(context, email);
        trackCtaClick(`flagship-${vertical}`, context);
        trackLead("flagship_playbook", context);
        router.push(`/playbook/${vertical}/thank-you?e=${encodeURIComponent(email)}`);
      } else {
        const data = (await res.json()) as { error?: string };
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <HoneypotInput value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          disabled={status === "loading"}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          disabled={status === "loading"}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "loading"
          ? "Sending your playbook..."
          : `Get the ${verticalTitle} Playbook`}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
      <p className="text-xs text-zinc-500">
        You&apos;ll get the playbook + workbook instantly, plus a 10-day email course. Unsubscribe anytime.
      </p>
    </form>
  );
}
