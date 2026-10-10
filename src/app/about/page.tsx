import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What Poop Rhymes is, how entries get in, and how to reach us.",
};

export default function AboutPage() {
  return (
    <article className="max-w-prose">
      <header className="py-10">
        <h1 className="display text-5xl sm:text-7xl">About</h1>
      </header>
      <div className="rule-heavy space-y-5 pt-8 text-lg leading-relaxed">
        <p>
          Poop Rhymes is a catalog of every time a rapper has brought up poop, farts, or toilets on record. Each entry has the bar,
          where it lands in the song, and an annotation explaining the setup, the context, and why it works.
        </p>
        <p>
          We started it because Lil Wayne alone has done this roughly a hundred times and nobody was keeping track.
        </p>

        <h2 className="display pt-6 text-3xl">How entries get in</h2>
        <p>
          Anyone can <Link href="/submit" className="font-semibold underline underline-offset-2">submit a bar</Link>. An editor checks
          that the song exists, the line is right, and the timestamp is close, then writes or edits the annotation. Entries that show
          the reference in our words instead of the quote are songs we know belong here but haven&rsquo;t finished transcribing.
        </p>

        <h2 className="display pt-6 text-3xl">What we quote</h2>
        <p>
          We quote the line or two the annotation is about, and nothing more. We don&rsquo;t host verses, choruses, or full lyrics;
          every page links to the whole song on the services that license it. The artists wrote these bars and own them. We just
          point at them and laugh.
        </p>

        <h2 id="takedown" className="display pt-6 text-3xl">Takedown requests</h2>
        <p>
          If you hold the rights to a song and would rather it not appear here, email{" "}
          <a href="mailto:hello@pooprhymes.com" className="font-semibold underline underline-offset-2">hello@pooprhymes.com</a> with the
          page URL and we&rsquo;ll take it down.
        </p>
      </div>
    </article>
  );
}
