import type { Metadata } from "next";
import { getSong } from "@/lib/catalog";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit a bar",
  description: "Know a rap lyric about poop, farts, or toilets that we're missing? Send it in.",
};

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ song?: string }> }) {
  const { song: songSlug } = await searchParams;
  const song = songSlug ? getSong(songSlug) : undefined;
  return (
    <>
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">Submit a bar</h1>
        <p className="mt-3 max-w-prose text-lg text-mute">
          {song
            ? `Help us finish the entry for “${song.title}”. We need the line and where it lands in the track.`
            : "Know one we're missing? Give us the song, the line, and the timestamp. We check every one before it goes up."}
        </p>
      </header>
      <div className="rule-heavy grid gap-10 pt-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <SubmitForm
          defaults={{
            artist: song?.artist ?? "",
            title: song?.title ?? "",
            categories: song?.categories ?? [],
            songSlug: song?.slug,
          }}
        />
        <aside className="space-y-4 text-mute lg:bg-ash lg:p-6">
          <h2 className="display text-2xl text-ink">House rules</h2>
          <p>Quote the line or two that does the job. We don&rsquo;t post verses or whole songs, and we won&rsquo;t publish a submission that does.</p>
          <p>Puns count. Titles count. A bar that only works if you squint will go to the community for a ruling.</p>
          <p>Tell us why it&rsquo;s funny. The annotation is the whole point.</p>
          <p>Non-rap submissions get deleted with love.</p>
        </aside>
      </div>
    </>
  );
}
