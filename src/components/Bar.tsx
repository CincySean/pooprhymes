import Link from "next/link";
import type { Song } from "@/lib/types";

/**
 * The highlighted excerpt. When the exact line hasn't been transcribed yet, the
 * highlight carries the editors' description of the reference instead, so the
 * entry still reads as a finished page and the empty bar is a quiet ask rather
 * than a hole.
 */
export function Bar({ song, size = "md", link = false }: { song: Song; size?: "md" | "lg" | "xl"; link?: boolean }) {
  const sizeClass =
    size === "xl"
      ? "text-3xl leading-tight sm:text-5xl sm:leading-[1.05]"
      : size === "lg"
        ? "text-2xl leading-snug sm:text-3xl"
        : "text-lg leading-snug";

  const text = song.bar || song.note || "";
  const lines = text.split("\n");
  const inner = lines.map((line, i) => (
    <span key={i}>
      <span className="bar-highlight">{line}</span>
      {i < lines.length - 1 && <br />}
    </span>
  ));

  return (
    <p className={`${sizeClass} font-semibold`}>
      {link ? (
        <Link href={`/songs/${song.slug}`} className="no-underline">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </p>
  );
}

/** Small line under an un-transcribed bar inviting the exact quote. */
export function BarAsk({ song, className = "" }: { song: Song; className?: string }) {
  if (song.bar) return null;
  return (
    <p className={`text-sm text-mute ${className}`}>
      That&rsquo;s the reference, in our words.{" "}
      <Link href={`/submit?song=${encodeURIComponent(song.slug)}`} className="font-semibold text-ink underline underline-offset-2">
        Know the exact line and timestamp?
      </Link>
    </p>
  );
}
