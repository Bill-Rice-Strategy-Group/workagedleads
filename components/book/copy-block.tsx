"use client";

import { useState } from "react";

/** A block of text a reader copies into their assistant. Plain text only. */
export function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the text is on screen to select by hand.
    }
  }

  return (
    <figure className="my-5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <figcaption className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 print:hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="whitespace-pre-wrap px-4 py-3 font-sans text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
        {text}
      </pre>
    </figure>
  );
}
