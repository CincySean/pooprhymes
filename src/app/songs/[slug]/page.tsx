import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { creditLine, displayRapper, getSong, publicSongs, songsByCategory } from "@/lib/catalog";
import { slugify } from "@/lib/slug";
import type { Song } from "@/lib/types";
import { Bar } from "@/components/Bar";
import { CoverArt } from "@/components/CoverArt";
import { CategoryPill } from "@/components/CategoryPill";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return publicSongs().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song) return {};
  return {
    title: `${song.title} by ${creditLine(song)}`,
    description: song.annotation.slice(0, 160),
  };
}

export default async function SongPage({ params }: { params: Params }) {
  const { slug } = await params;
  const song = getSong(slug);
  if (!song || song.status === "pending") notFound();

  const rapper = displayRapper(song);
  const related = song.categories
    .flatMap((c) => songsByCategory(c))
    .filter((s, i, arr) => s.slug !== song.slug && arr.findIndex((x) => x.slug === s.slug) === i)
    .slice(0, 5);
  const paragraphs = song.annotation.split(/\n\n+/);

  return (
    <article>
      <header className="flex flex-wrap items-end gap-6 py-10">
        <CoverArt song={song} className="h-32 w-32 text-7xl sm:h-44 sm:w-44 sm:text-8xl" />
        <div className="min-w-0 flex-1">
          <h1 className="display text-4xl sm:text-6xl">{song.title}</h1>
          <p className="mt-2 text-lg">
            <Link href={`/artists/${slugify(song.artist)}`} className="font-bold hover:underline">
              {song.artist}
            </Link>
            {song.features?.map((f) => (
              <span key={f} className="text-mute">
                {" "}
                feat.{" "}
                <Link href={`/artists/${slugify(f)}`} className="font-semibold text-ink hover:underline">
                  {f}
                </Link>
              </span>
            ))}
          </p>
          <p className="text-mute">
            {[song.album, song.year].filter(Boolean).join(", ")}
            {song.timestamp && <> · the bar lands at {song.timestamp}</>}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {song.categories.map((c) => (
              <CategoryPill key={c} id={c} />
            ))}
          </div>
        </div>
      </header>

      {/* The marked-up-lyric layout: bar on the left, annotation card on the right. */}
      <div className="rule-heavy grid gap-10 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <section aria-labelledby="the-bar">
          <h2 id="the-bar" className="mb-4 text-sm font-semibold text-mute">
            The bar{song.rapper && song.rapper !== song.artist ? ` (${rapper}'s verse)` : ""}
          </h2>
          <Bar song={song} size="xl" />
          {song.status === "needs_bar" && song.note && (
            <p className="mt-6 max-w-prose text-mute">
              What we know so far: {song.note}{" "}
              <Link href={`/submit?song=${encodeURIComponent(song.slug)}`} className="font-semibold text-ink underline underline-offset-2">
                Add the line and timestamp.
              </Link>
            </p>
          )}
          <ListenLinks song={song} />
        </section>

        <section className="border-l-4 border-stain pl-5 lg:border-l-0 lg:border-t-0 lg:bg-ash lg:p-6" aria-labelledby="annotation">
          <h2 id="annotation" className="display text-2xl">
            Annotation
          </h2>
          <div className="mt-3 space-y-4 text-[1.05rem] leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {song.source && (
            <p className="mt-5 text-sm text-mute">
              Tipped off by{" "}
              {song.source.startsWith("http") ? (
                <a href={song.source} className="underline underline-offset-2" rel="noopener noreferrer">
                  {new URL(song.source).hostname.replace(/^www\./, "")}
                </a>
              ) : (
                song.source
              )}
              .
            </p>
          )}
          <p className="mt-5 text-sm text-mute">
            Think the annotation is wrong, or missing the point?{" "}
            <Link href={`/submit?song=${encodeURIComponent(song.slug)}`} className="font-semibold text-ink underline underline-offset-2">
              Suggest a fix.
            </Link>
          </p>
        </section>
      </div>

      {related.length > 0 && (
        <section className="rule-heavy mt-14 pt-5" aria-labelledby="related">
          <h2 id="related" className="display text-2xl">
            More like this
          </h2>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug} className="rule-thin py-3">
                <Link href={`/songs/${s.slug}`} className="font-semibold hover:underline">
                  {s.title}
                </Link>
                <span className="block text-sm text-mute">
                  {creditLine(s)}
                  {s.year ? `, ${s.year}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function ListenLinks({ song }: { song: Song }) {
  const q = encodeURIComponent(`${song.artist} ${song.title}`);
  const links = [
    { label: "Spotify", href: song.links?.spotify ?? `https://open.spotify.com/search/${q}` },
    { label: "Apple Music", href: song.links?.apple ?? `https://music.apple.com/us/search?term=${q}` },
    { label: "YouTube", href: song.links?.youtube ?? `https://www.youtube.com/results?search_query=${q}` },
  ];
  return (
    <p className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
      <span className="font-semibold">Hear the whole song:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} rel="noopener noreferrer" className="underline underline-offset-2 hover:text-stain-deep">
          {l.label}
        </a>
      ))}
    </p>
  );
}
