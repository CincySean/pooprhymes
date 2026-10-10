import { NextResponse } from "next/server";
import { isCategoryId } from "@/lib/categories";
import { saveSubmission } from "@/lib/submissions";
import type { CategoryId } from "@/lib/types";

const MAX_BAR_WORDS = 30;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot filled in → bot. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const artist = str("artist");
  const title = str("title");
  const bar = str("bar");
  const timestamp = str("timestamp");
  const whyItsFunny = str("whyItsFunny");
  const submitterName = str("submitterName");
  const submitterEmail = str("submitterEmail");
  const categories = (Array.isArray(body.categories) ? body.categories : []).filter(
    (c): c is CategoryId => typeof c === "string" && isCategoryId(c),
  );

  if (!artist || !title) return NextResponse.json({ ok: false, error: "Artist and song are required." }, { status: 400 });
  if (!bar) return NextResponse.json({ ok: false, error: "We need the bar itself." }, { status: 400 });
  if (bar.split(/\s+/).length > MAX_BAR_WORDS || bar.split("\n").length > 2) {
    return NextResponse.json({ ok: false, error: "Keep it to the line or two that mentions it. We can't post verses." }, { status: 400 });
  }
  if (timestamp && !/^\d{1,2}:\d{2}$/.test(timestamp)) {
    return NextResponse.json({ ok: false, error: "Timestamp should look like 1:42." }, { status: 400 });
  }
  if (submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }

  await saveSubmission({
    artist,
    title,
    bar,
    timestamp: timestamp || undefined,
    categories,
    whyItsFunny: whyItsFunny || undefined,
    submitterName: submitterName || undefined,
    submitterEmail: submitterEmail || undefined,
  });

  return NextResponse.json({ ok: true });
}
