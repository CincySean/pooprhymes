import songsJson from "../../data/songs.json";
import type { CategoryId, Song } from "./types";
import { slugify } from "./slug";

const SONGS: Song[] = songsJson as Song[];

export function allSongs(): Song[] {
  return SONGS;
}

/** Songs that are ready to display publicly (verified or still awaiting a bar). Pending submissions never ship in the JSON. */
export function publicSongs(): Song[] {
  return SONGS.filter((s) => s.status !== "pending");
}

export function getSong(slug: string): Song | undefined {
  return SONGS.find((s) => s.slug === slug);
}

export function songsByCategory(cat: CategoryId): Song[] {
  return publicSongs()
    .filter((s) => s.categories.includes(cat))
    .sort(byScore);
}

export function hallOfFame(limit = 25): Song[] {
  return [...publicSongs()].sort(byScore).slice(0, limit);
}

export function recentlyAdded(limit = 8): Song[] {
  // JSON order is insertion order; newest entries go at the end of the file.
  return [...publicSongs()].reverse().slice(0, limit);
}

export interface ArtistSummary {
  slug: string;
  name: string;
  count: number;
  songs: Song[];
}

/** Every artist who appears as primary artist, feature, or the rapper who said the bar. */
export function allArtists(): ArtistSummary[] {
  const map = new Map<string, ArtistSummary>();
  for (const song of publicSongs()) {
    const names = new Set<string>([song.artist, ...(song.features ?? []), ...(song.rapper ? [song.rapper] : [])]);
    for (const name of names) {
      const slug = slugify(name);
      const entry = map.get(slug) ?? { slug, name, count: 0, songs: [] };
      entry.count += 1;
      entry.songs.push(song);
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getArtist(slug: string): ArtistSummary | undefined {
  return allArtists().find((a) => a.slug === slug);
}

/** Deterministic "Rhyme of the Day": rotates through the catalog by day of year. */
export function rhymeOfTheDay(date = new Date()): Song {
  const songs = publicSongs();
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  return songs[dayOfYear % songs.length];
}

export function searchSongs(query: string): Song[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return publicSongs()
    .map((song) => {
      const haystack = [
        song.title,
        song.artist,
        ...(song.features ?? []),
        song.rapper ?? "",
        song.album ?? "",
        String(song.year ?? ""),
        song.bar,
        song.annotation,
        song.note ?? "",
        ...song.categories,
      ]
        .join(" ")
        .toLowerCase();
      const hits = terms.filter((t) => haystack.includes(t)).length;
      // Title/artist matches weigh more than annotation matches.
      const bonus = terms.filter((t) => song.title.toLowerCase().includes(t) || song.artist.toLowerCase().includes(t)).length;
      return { song, rank: hits === terms.length ? hits + bonus * 2 : 0 };
    })
    .filter((r) => r.rank > 0)
    .sort((a, b) => b.rank - a.rank || b.song.score - a.song.score)
    .map((r) => r.song);
}

export function byScore(a: Song, b: Song): number {
  return b.score - a.score || a.title.localeCompare(b.title);
}

export function displayRapper(song: Song): string {
  return song.rapper ?? song.artist;
}

export function creditLine(song: Song): string {
  const feats = song.features?.length ? ` feat. ${song.features.join(", ")}` : "";
  return `${song.artist}${feats}`;
}
