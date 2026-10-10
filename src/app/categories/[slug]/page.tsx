import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_MAP, isCategoryId } from "@/lib/categories";
import { songsByCategory } from "@/lib/catalog";
import { SongRow } from "@/components/SongRow";
import { CategoryPill } from "@/components/CategoryPill";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategoryId(slug)) return {};
  const c = CATEGORY_MAP[slug];
  return { title: c.label, description: `Rap bars about ${c.label.toLowerCase()}: ${c.blurb}` };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isCategoryId(slug)) notFound();
  const category = CATEGORY_MAP[slug];
  const songs = songsByCategory(slug);
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">
          <span aria-hidden="true">{category.emoji} </span>
          {category.label}
        </h1>
        <p className="mt-3 max-w-prose text-lg text-mute">{category.blurb}</p>
        <nav className="mt-5 flex flex-wrap gap-1.5" aria-label="All subjects">
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.id} id={c.id} active={c.id === slug} />
          ))}
        </nav>
      </header>
      {songs.length === 0 ? (
        <p className="rule-heavy pt-6 text-lg">
          Nothing filed under {category.label.toLowerCase()} yet. You could be the first to submit one.
        </p>
      ) : (
        <ol className="rule-heavy">
          {songs.map((song, i) => (
            <SongRow key={song.slug} song={song} rank={i + 1} />
          ))}
        </ol>
      )}
    </>
  );
}
