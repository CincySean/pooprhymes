import type { Metadata } from "next";
import { searchSongs } from "@/lib/catalog";
import { SongRow } from "@/components/SongRow";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = searchSongs(q);
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">Search</h1>
        <div className="mt-5 max-w-2xl">
          <SearchBox large defaultValue={q} />
        </div>
      </header>
      {q.trim() === "" ? (
        <p className="rule-heavy pt-6 text-lg text-mute">Try an artist, a song, a year, or a word that might be in the bar.</p>
      ) : results.length === 0 ? (
        <p className="rule-heavy pt-6 text-lg">
          No bars match &ldquo;{q}&rdquo;. If you know one that should, submit it and we&rsquo;ll add it.
        </p>
      ) : (
        <>
          <p className="rule-heavy pt-5 text-sm text-mute">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
          </p>
          <ol>
            {results.map((song) => (
              <SongRow key={song.slug} song={song} />
            ))}
          </ol>
        </>
      )}
    </>
  );
}
