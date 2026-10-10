# pooprhymes.com

Every rap bar about poop, farts, and toilets, annotated. Built on the **excerpt model**: each entry quotes the one or two lines
that matter, explains why they land, and links out to the full song. No verses, no full lyrics.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # sanity-checks data/songs.json
npm run build      # production build
```

Requires Node 18.18+ (Node 20 or 22 recommended).

## Deploy

Push the repo to GitHub and import it in Vercel. Zero config: Vercel detects Next.js. Point `pooprhymes.com` at the
project in Vercel's Domains tab.

The only thing that doesn't work out of the box on Vercel is **saving submissions**, because the filesystem there is
read-only. See "Submissions" below.

## How the site is organized

```
data/songs.json            the catalog — every entry on the site lives here
data/submissions/          incoming submissions when running locally (gitignored)
scripts/validate-catalog.mjs   checks the catalog before you commit
src/lib/types.ts           the Song and Submission shapes
src/lib/categories.ts      the subject categories (poop, fart, toilet, ...)
src/lib/catalog.ts         queries: hall of fame, rhyme of the day, search, artists
src/lib/submissions.ts     where submissions get stored (swap this for Supabase)
src/app/                   pages
  page.tsx                   home: rhyme of the day, hall of fame, categories
  songs/[slug]/              one entry: the bar + the annotation
  artists/, artists/[slug]/  everyone in the catalog
  categories/[slug]/         browse by subject
  hall-of-fame/              top 25 by score
  search/                    full-text search over the catalog
  submit/                    public submission form
  api/submit/                receives the form
  about/                     what the site is, house rules, takedown contact
src/components/            Header, Footer, Bar (the highlighted excerpt), SongRow, etc.
```

## Adding an entry

Append an object to `data/songs.json`. The important fields:

| field        | notes |
|--------------|-------|
| `slug`       | kebab-case, unique, used in the URL (`/songs/<slug>`) |
| `title`, `artist`, `features`, `rapper` | `rapper` is who actually says the bar if it's not the primary artist |
| `bar`        | the excerpt. **Two lines max, 30 words max.** The validator enforces this. Use `\n` for a line break. |
| `timestamp`  | `m:ss` where the bar lands |
| `categories` | one or more ids from `src/lib/categories.ts` |
| `annotation` | the write-up. Plain text; separate paragraphs with a blank line (`\n\n`) |
| `note`       | one-line non-lyrical description of the reference, shown while `bar` is still empty |
| `score`      | drives Hall of Fame order until voting exists |
| `status`     | `verified` once the bar and timestamp are checked; `needs_bar` while they're not |
| `source`     | URL or a short credit for where the tip came from |

Run `npm run validate` before committing. Newest entries go at the end of the file; the home page's "Recently added"
reads from the bottom up.

### The seed catalog

The 69 entries shipped here were pulled from published lists and reviews (Complex's fart-rap roundup, Vice's history of poop
rap and its Lil Wayne guide, Songfacts, Wikipedia, Miami New Times, The Source, and others; each entry's `source` says which).
Every one has artist, song, year, categories, a `note` describing the reference in our own words, and a written annotation.
The `bar` (the exact quoted line) and `timestamp` are blank on all of them. While `bar` is empty the page shows the `note` in
the highlight instead, so entries read as complete; once you fill in the line and timestamp, flip `status` to `verified`.

### Cover art

`npm run covers` fills `coverUrl` and `links.apple` for every entry from the iTunes Search API (no key required). It skips
entries that already have art; `--force` redoes them all. Check `git diff` afterwards for mismatches.

## Submissions

Locally, `POST /api/submit` writes one JSON file per submission into `data/submissions/`. The form has basic validation
(bar length, timestamp format, honeypot for bots).

For production, replace the body of `saveSubmission` in `src/lib/submissions.ts` with a Supabase insert. The `Submission`
type maps directly onto a table:

```sql
create table submissions (
  id uuid primary key,
  received_at timestamptz not null,
  artist text not null,
  title text not null,
  bar text not null,
  timestamp text,
  categories text[] not null default '{}',
  why_its_funny text,
  submitter_name text,
  submitter_email text,
  status text not null default 'pending'
);
```

Then `npm install @supabase/supabase-js`, put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel's environment
variables, and insert. Reviewing submissions can start as "read the table in the Supabase dashboard, copy approved ones into
`songs.json`"; an `/admin` page is phase 2.

## Phase 2 ideas, roughly in order

1. Real cover art: Spotify's search API gives you album art and a track link for free with a client-credentials token. Fill
   `coverUrl` and `links.spotify` at build time.
2. An `/admin` page behind `ADMIN_TOKEN` that lists pending submissions with approve / reject buttons that append to
   `songs.json` through a GitHub commit (or move the catalog itself into Supabase).
3. Upvotes on entries, replacing the hand-set `score`.
4. "Rhyme of the day" posting itself to a social account.
5. A tiny public JSON endpoint (`/api/random`) so people can embed a random bar.

## Design notes

The look borrows the marked-up-lyric pattern — a highlighted excerpt with the explanation beside it — with a brown highlight
instead of yellow. Type is Archivo (body) and Archivo Black (display), loaded through `next/font`. Colors are Tailwind v4
theme tokens in `src/app/globals.css`: `paper`, `ink`, `ash`, `rule`, `mute`, `stain`, `stain-deep`. The `.bar-highlight`
class is the one visual idea; everything else stays black on white.
