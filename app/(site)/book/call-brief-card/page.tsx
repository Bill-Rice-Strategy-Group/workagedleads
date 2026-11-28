import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Call-Brief Card to Print: Nobody Answers",
  description:
    "A printable call-brief card from Nobody Answers: the brief on the front, the after-call note on the back, four to a sheet.",
  alternates: { canonical: `${SITE_URL}/book/call-brief-card` },
};

// The headings are the call brief from Chapter 6 and the after-call note from
// Step 5 of the appendix, in the book's order. Keep them in step with the book.
const FRONT = [
  "Who · town · how far · video?",
  "Asked for, and when",
  "Said since (word for word)",
  "What probably matters",
  "Start with",
  "Don't",
  "Open promises",
];
const BACK = ["Who it was", "What they said", "What matters", "What I promised, and when"];

function Card({ side }: { side: "front" | "back" }) {
  const rows = side === "front" ? FRONT : BACK;
  return (
    <div className="flex h-full flex-col border border-zinc-400 p-3 text-zinc-900">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider">
        {side === "front" ? "Call brief: read before you dial" : "After-call note: write before you forget"}
      </p>
      <div className="flex flex-1 flex-col">
        {rows.map((r) => (
          <div key={r} className="flex flex-1 border-b border-zinc-300 pt-1 text-[10px] text-zinc-600">
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function Sheet({ side }: { side: "front" | "back" }) {
  return (
    <div className={`mx-auto grid aspect-[8.5/11] w-full max-w-[8.5in] grid-cols-2 grid-rows-2 gap-4 bg-white p-6 ${side === "back" ? "break-before-page" : ""} print:aspect-auto print:h-[10in] print:w-[7.5in] print:max-w-none print:p-0`}>
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} side={side} />
      ))}
    </div>
  );
}

export default function CallBriefCardPage() {
  return (
    <div data-print-cards className="mx-auto max-w-4xl px-4 py-10 print:p-0">
      {/* Print only the two sheets: drop the site's promo bar, header,
          disclosure and footer, which would push each side onto two pages. */}
      <style>{`@media print {
        @page { size: letter; margin: 0.5in; }
        body:has([data-print-cards]) .min-h-screen > :not(main) { display: none !important; }
      }`}</style>
      <div className="mb-6 print:hidden">
        <Link href="/book#call-brief" className="text-sm underline">
          ← Back to the guide
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">The call-brief card</h1>
        <p className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
          Print both pages on one sheet, front and back, then cut into four. Brief on the front,
          after-call note on the back. Use your browser&apos;s Print command.
        </p>
      </div>
      <Sheet side="front" />
      <div className="h-8 print:hidden" />
      <Sheet side="back" />
    </div>
  );
}
