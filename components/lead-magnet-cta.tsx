"use client";

import { useState, type FormEvent } from "react";
import { trackNewsletterSignup, trackCtaClick, trackLead } from "./analytics";
import { HoneypotInput } from "./honeypot-input";

interface LeadMagnetCtaProps {
  variant?: "inline" | "card" | "banner";
  heading?: string;
  description?: string;
  buttonText?: string;
  leadMagnetId?: string;
  features?: string[];
  context?: string;
  downloadUrl?: string;
}

export function LeadMagnetCta({
  variant = "card",
  heading = "Free: Aged Lead Prospecting Checklist",
  description = "Download our step-by-step checklist for working aged leads — covering outreach scripts, compliance reminders, and a 7-day workflow.",
  buttonText = "Get the Free Checklist",
  leadMagnetId = "prospecting-checklist",
  features,
  context = "default",
  downloadUrl,
}: LeadMagnetCtaProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, leadMagnet: leadMagnetId, website }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage(downloadUrl ? "Your download is ready!" : "Check your email! Your download is on the way.");
        trackNewsletterSignup(context, email);
        trackCtaClick(leadMagnetId, context);
        trackLead("lead_magnet", context);
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (variant === "inline") {
    return (
      <div className="my-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/50">
        <p className="font-medium text-zinc-900 dark:text-white">{heading}</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        {status === "success" ? (
          <div className="mt-3">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{message}</p>
            {downloadUrl && (
              <a href={downloadUrl} download className="mt-2 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Download PDF
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <HoneypotInput value={website} onChange={setWebsite} />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "loading" ? "..." : buttonText}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <section className="bg-gradient-to-br from-zinc-900 to-blue-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300">{description}</p>
          {features && (
            <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left text-zinc-300">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-blue-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          {status === "success" ? (
            <div className="mt-8">
              <p className="text-lg font-medium text-white">{message}</p>
              {downloadUrl && (
                <a href={downloadUrl} download className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                  Download PDF
                </a>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <HoneypotInput value={website} onChange={setWebsite} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : buttonText}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">{message}</p>
          )}
          <p className="mt-4 text-xs text-zinc-500">
            We&apos;ll also subscribe you to our weekly newsletter. Unsubscribe anytime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-blue-900 dark:from-blue-950/50 dark:to-zinc-900">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{heading}</h3>
      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {features && (
        <ul className="mt-4 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="mt-0.5 text-blue-500">✓</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      {status === "success" ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">{message}</p>
          {downloadUrl && (
            <a href={downloadUrl} download className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Download PDF
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <HoneypotInput value={website} onChange={setWebsite} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : buttonText}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
      <p className="mt-3 text-xs text-zinc-500">
        We&apos;ll also subscribe you to our weekly newsletter. Unsubscribe anytime.
      </p>
    </div>
  );
}
