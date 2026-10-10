import type { Metadata } from "next";
import Link from "next/link";
import { allArtists } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Artists",
  description: "Every rapper in the catalog, ranked by how often they bring up the bathroom.",
};

export default function ArtistsPage() {
  const artists = allArtists();
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">Artists</h1>
        <p className="mt-3 max-w-prose text-lg text-mute">Ranked by number of entries. One of these people is not like the others.</p>
      </header>
      <ol className="rule-heavy grid sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((a, i) => (
          <li key={a.slug} className="rule-thin flex items-baseline gap-3 py-3 sm:pr-6">
            <span className="display w-8 shrink-0 text-xl text-mute tabular-nums">{i + 1}</span>
            <Link href={`/artists/${a.slug}`} className="font-bold hover:underline">
              {a.name}
            </Link>
            <span className="ml-auto text-sm text-mute tabular-nums">
              {a.count} {a.count === 1 ? "bar" : "bars"}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
