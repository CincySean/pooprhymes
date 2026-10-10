// Fills coverUrl and links.apple for every song in data/songs.json using the
// iTunes Search API (no key needed). Safe to re-run: entries that already have
// a coverUrl are skipped unless you pass --force.
//
//   node scripts/fetch-covers.mjs
//   node scripts/fetch-covers.mjs --force
//
// Review the result in git diff before committing; the match is by
// "artist title" search and can occasionally pick a remix or a cover.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../data/songs.json", import.meta.url);
const force = process.argv.includes("--force");
const songs = JSON.parse(readFileSync(FILE, "utf8"));

const clean = (s) => s.replace(/\(.*?\)/g, "").replace(/[^\w\s'&$.-]/g, " ").trim();

async function lookup(song) {
  const term = encodeURIComponent(`${clean(song.artist)} ${clean(song.title)}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=5&country=US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${song.slug}`);
  const data = await res.json();
  const artistLc = song.artist.toLowerCase();
  const hit =
    data.results.find((r) => r.artistName.toLowerCase().includes(artistLc)) ??
    data.results.find((r) => artistLc.includes(r.artistName.toLowerCase())) ??
    data.results[0];
  return hit;
}

let updated = 0;
for (const song of songs) {
  if (song.coverUrl && !force) continue;
  try {
    const hit = await lookup(song);
    if (!hit) {
      console.log(`no match   ${song.slug}`);
      continue;
    }
    song.coverUrl = hit.artworkUrl100.replace("100x100bb", "600x600bb");
    song.links = { ...(song.links ?? {}), apple: hit.trackViewUrl };
    if (!song.album && hit.collectionName) song.album = hit.collectionName.replace(/ \(.*?(Deluxe|Explicit|Edition).*?\)$/i, "");
    updated += 1;
    console.log(`ok         ${song.slug}  ←  ${hit.artistName} – ${hit.trackName} (${hit.collectionName})`);
  } catch (err) {
    console.log(`error      ${song.slug}: ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 350)); // be polite to the API
}

writeFileSync(FILE, JSON.stringify(songs, null, 2) + "\n");
console.log(`\nUpdated ${updated} entries. Run \`git diff data/songs.json\` to review.`);
