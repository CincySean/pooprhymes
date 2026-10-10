import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { creditLine, hallOfFame, publicSongs, recentlyAdded, rhymeOfTheDay, songsByCategory } from "@/lib/catalog";
import { Bar } from "@/components/Bar";
import { CoverArt } from "@/components/CoverArt";
import { SongRow } from "@/components/SongRow";
import { SearchBox } from "@/components/SearchBox";

export const revalidate = 3600; // rhyme of the day rotates; rebuild hourly

export default function HomePage() {
  const today = rhymeOfTheDay();
  const top = hallOfFame(10);
  const recent = recentlyAdded(6);
  const total = publicSongs().length;

  return (
    <>
      {/* Rhyme of the Day: the one place the site is loud. */}
      <section className="grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end sm:py-14" aria-labelledby="rotd">
        <div className="max-w-3xl">
          <h1 id="rotd" className="mb-5 text-sm font-semibold text-mute">
            Rhyme of the day
          </h1>
          <Bar song={today} size="xl" link />
          <p className="mt-6 text-lg">
            <Link href={`/songs/${today.slug}`} className="font-bold hover:underline">
              {today.title}
            </Link>
            <span className="text-mute">
              {" "}
              — {creditLine(today)}
              {today.year ? `, ${today.year}` : ""}
            </span>
          </p>
          <p className="mt-3 max-w-xl text-mute">{firstSentence(today.annotation)}</p>
          <Link href={`/songs/${today.slug}`} className="mt-4 inline-block font-semibold underline underline-offset-4">
            Read the annotation
          </Link>
        </div>
        <Link href={`/songs/${today.slug}`} className="hidden sm:block" aria-hidden="true" tabIndex={-1}>
          <CoverArt song={today} className="h-48 w-48 text-9xl lg:h-56 lg:w-56" />
        </Link>
      </section>

      <section className="rule-heavy py-8" aria-label="Search">
        <div className="max-w-2xl">
          <SearchBox large />
          <p className="mt-2 text-sm text-mute">
            {total} songs catalogued so far. Missing one?{" "}
            <Link href="/submit" className="font-semibold text-ink underline underline-offset-2">
              Submit a bar.
            </Link>
          </p>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rule-heavy pt-5" aria-labelledby="hof">
          <div className="flex items-baseline justify-between">
            <h2 id="hof" className="display text-3xl">
              Hall of Fame
            </h2>
            <Link href="/hall-of-fame" className="text-sm font-semibold hover:underline">
              See all 25
            </Link>
          </div>
          <ol className="mt-2">
            {top.map((song, i) => (
              <SongRow key={song.slug} song={song} rank={i + 1} />
            ))}
          </ol>
        </section>

        <aside className="space-y-10">
          <section className="rule-heavy pt-5" aria-labelledby="cats">
            <h2 id="cats" className="display text-3xl">
              Browse by subject
            </h2>
            <ul className="mt-3 divide-y divide-rule">
              {CATEGORIES.map((c) => {
                const n = songsByCategory(c.id).length;
                return (
                  <li key={c.id}>
                    <Link href={`/categories/${c.id}`} className="flex items-baseline justify-between gap-3 py-2.5 hover:bg-ash">
                      <span>
                        <span aria-hidden="true" className="mr-2">
                          {c.emoji}
                        </span>
                        <span className="font-semibold">{c.label}</span>
                        <span className="ml-2 text-sm text-mute">{c.blurb}</span>
                      </span>
                      <span className="shrink-0 text-sm text-mute tabular-nums">{n}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rule-heavy pt-5" aria-labelledby="recent">
            <h2 id="recent" className="display text-3xl">
              Recently added
            </h2>
            <ul className="mt-3 divide-y divide-rule">
              {recent.map((song) => (
                <li key={song.slug} className="py-2.5">
                  <Link href={`/songs/${song.slug}`} className="font-semibold hover:underline">
                    {song.title}
                  </Link>
                  <span className="block text-sm text-mute">{creditLine(song)}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return m ? m[0].trim() : text;
}
