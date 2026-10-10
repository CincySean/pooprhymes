import Link from "next/link";
import type { Song } from "@/lib/types";
import { creditLine } from "@/lib/catalog";
import { CoverArt } from "./CoverArt";
import { CategoryPill } from "./CategoryPill";
import { Bar } from "./Bar";

export function SongRow({ song, rank }: { song: Song; rank?: number }) {
  return (
    <li className="rule-thin flex gap-4 py-5 first:border-t-0">
      {rank !== undefined && (
        <span className="display w-10 shrink-0 pt-1 text-3xl text-mute tabular-nums" aria-label={`Rank ${rank}`}>
          {rank}
        </span>
      )}
      <Link href={`/songs/${song.slug}`} className="shrink-0">
        <CoverArt song={song} className="h-20 w-20 text-5xl sm:h-24 sm:w-24" />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold leading-tight">
          <Link href={`/songs/${song.slug}`} className="hover:underline">
            {song.title}
          </Link>
        </h3>
        <p className="text-sm text-mute">
          {creditLine(song)}
          {song.year ? `, ${song.year}` : ""}
        </p>
        <div className="mt-2">
          <Bar song={song} link />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {song.categories.map((c) => (
            <CategoryPill key={c} id={c} />
          ))}
        </div>
      </div>
    </li>
  );
}
