import type { MetadataRoute } from "next";
import { allArtists, publicSongs } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pooprhymes.com";
  return [
    { url: base },
    { url: `${base}/hall-of-fame` },
    { url: `${base}/artists` },
    { url: `${base}/submit` },
    { url: `${base}/about` },
    ...publicSongs().map((s) => ({ url: `${base}/songs/${s.slug}` })),
    ...allArtists().map((a) => ({ url: `${base}/artists/${a.slug}` })),
    ...CATEGORIES.map((c) => ({ url: `${base}/categories/${c.id}` })),
  ];
}
