import Link from "next/link";
import type { Song } from "@/lib/types";

/**
 * The excerpt. One or two lines, highlighted. When nobody has transcribed the
 * bar yet, the empty state is an invitation to go find it.
 */
export function Bar({ song, size = "md", link = false }: { song: Song; size?: "md" | "lg" | "xl"; link?: boolean }) {
  const sizeClass =
    size === "xl"
      ? "text-3xl leading-tight sm:text-5xl sm:leading-[1.05]"
      : size === "lg"
        ? "text-2xl leading-snug sm:text-3xl"
        : "text-lg leading-snug";

  if (!song.bar) {
    return (
      <p className={`${sizeClass} font-semibold`}>
        <Link href={`/submit?song=${encodeURIComponent(song.slug)}`} className="bar-highlight">
          Bar not transcribed yet. Know the line and the timestamp?
        </Link>
      </p>
    );
  }

  const lines = song.bar.split("\n");
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
