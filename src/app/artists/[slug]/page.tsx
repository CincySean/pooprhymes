import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allArtists, byScore, getArtist } from "@/lib/catalog";
import { SongRow } from "@/components/SongRow";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return allArtists().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  return { title: artist.name, description: `${artist.count} poop, fart, and toilet bars from ${artist.name}, annotated.` };
}

export default async function ArtistPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();
  const songs = [...artist.songs].sort(byScore);
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">{artist.name}</h1>
        <p className="mt-3 text-lg text-mute">
          {artist.count} {artist.count === 1 ? "entry" : "entries"} in the catalog.
        </p>
      </header>
      <ol className="rule-heavy">
        {songs.map((song) => (
          <SongRow key={song.slug} song={song} />
        ))}
      </ol>
    </>
  );
}
