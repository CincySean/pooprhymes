import type { Metadata } from "next";
import { hallOfFame } from "@/lib/catalog";
import { SongRow } from "@/components/SongRow";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "The 25 greatest poop, fart, and toilet bars in rap, ranked.",
};

export default function HallOfFamePage() {
  const songs = hallOfFame(25);
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">Hall of Fame</h1>
        <p className="mt-3 max-w-prose text-lg text-mute">
          The {songs.length} bars that define the form, ranked by the editors. Voting is coming; until then, argue in the
          submissions.
        </p>
      </header>
      <ol className="rule-heavy">
        {songs.map((song, i) => (
          <SongRow key={song.slug} song={song} rank={i + 1} />
        ))}
      </ol>
    </>
  );
}
