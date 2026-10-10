import type { Song } from "@/lib/types";

/* Placeholder cover until real artwork is wired up (Spotify / Apple API).
   A deterministic stain-coloured block with the artist's initials. */
export function CoverArt({ song, className = "" }: { song: Song; className?: string }) {
  if (song.coverUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={song.coverUrl} alt={`${song.title} cover`} className={`block object-cover ${className}`} />;
  }
  const initials = song.artist
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const hue = [...song.slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 0);
  return (
    <div
      aria-hidden="true"
      className={`display flex items-center justify-center text-paper ${className}`}
      style={{ background: `hsl(${20 + (hue % 25)} 45% ${22 + (hue % 18)}%)` }}
    >
      <span className="text-[38%]">{initials}</span>
    </div>
  );
}
