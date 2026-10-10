// Sanity-checks data/songs.json: unique slugs, known categories, required fields,
// and the house rule that a bar is never more than two short lines.
import { readFileSync } from "node:fs";

const CATEGORIES = new Set(["poop", "fart", "toilet", "diarrhea", "wiping", "flush", "stink", "diaper", "constipation"]);
const STATUSES = new Set(["verified", "needs_bar", "pending"]);
const MAX_BAR_WORDS = 30;

const songs = JSON.parse(readFileSync(new URL("../data/songs.json", import.meta.url), "utf8"));
const errors = [];
const slugs = new Set();

for (const [i, s] of songs.entries()) {
  const where = `#${i} (${s.slug ?? "no slug"})`;
  for (const field of ["slug", "title", "artist", "categories", "annotation", "score", "status"]) {
    if (s[field] === undefined || s[field] === "") errors.push(`${where}: missing ${field}`);
  }
  if (typeof s.bar !== "string") errors.push(`${where}: bar must be a string (use "" when not yet transcribed)`);
  if (slugs.has(s.slug)) errors.push(`${where}: duplicate slug`);
  slugs.add(s.slug);
  if (s.slug && !/^[a-z0-9-]+$/.test(s.slug)) errors.push(`${where}: slug must be kebab-case`);
  for (const c of s.categories ?? []) if (!CATEGORIES.has(c)) errors.push(`${where}: unknown category "${c}"`);
  if (!STATUSES.has(s.status)) errors.push(`${where}: unknown status "${s.status}"`);
  if (s.status === "verified" && !s.bar) errors.push(`${where}: verified entries need a bar`);
  if (s.status === "verified" && !s.timestamp) errors.push(`${where}: verified entries need a timestamp`);
  if (s.bar && s.bar.split(/\s+/).length > MAX_BAR_WORDS) errors.push(`${where}: bar is over ${MAX_BAR_WORDS} words — keep excerpts short`);
  if (s.bar && s.bar.split("\n").length > 2) errors.push(`${where}: bar is more than two lines`);
  if (s.timestamp && !/^\d{1,2}:\d{2}$/.test(s.timestamp)) errors.push(`${where}: timestamp must be m:ss`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const verified = songs.filter((s) => s.status === "verified").length;
console.log(`OK: ${songs.length} songs, ${verified} verified, ${songs.length - verified} still need a bar.`);
