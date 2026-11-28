import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isGoodOrigin, isHoneypotFilled } from "@/lib/anti-spam";

/**
 * "Email me when this guide changes" for workagedleads.com/book.
 *
 * A SEPARATE LIST, ON PURPOSE. The reader asked for change notices about the
 * book's guide, not for the weekly newsletter, so they are not added to
 * RESEND_AUDIENCE_ID. They go to their own audience, RESEND_BOOK_AUDIENCE_ID.
 *
 * If that variable is not set, the signup form is not rendered (see
 * app/(site)/book/page.tsx), and this route refuses rather than accepting an
 * address it has nowhere to keep.
 */
export async function POST(request: Request) {
  if (!isGoodOrigin(request)) return NextResponse.json({ success: true });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (isHoneypotFilled(body)) return NextResponse.json({ success: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_BOOK_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.warn("[BookUpdates] RESEND_API_KEY or RESEND_BOOK_AUDIENCE_ID not set");
    return NextResponse.json({ error: "Signups aren't open yet." }, { status: 503 });
  }

  try {
    const { error } = await new Resend(apiKey).contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    // An existing contact is fine: they're already on the list.
    if (error && !/already exists/i.test(error.message)) {
      console.error(`[BookUpdates] ${error.message}`);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error(`[BookUpdates] ${err instanceof Error ? err.message : "unknown"}`);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
