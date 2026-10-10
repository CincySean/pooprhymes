import Link from "next/link";

export function Footer() {
  return (
    <footer className="rule-heavy mt-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-4 px-4 py-6 text-sm text-mute sm:px-6">
        <p>
          <span className="font-semibold text-ink">Poop Rhymes</span> annotates the bars. We quote a line or two for commentary and link
          you to the full song. Artists own their lyrics.
        </p>
        <nav className="flex gap-5" aria-label="Footer">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/submit" className="hover:underline">Submit a bar</Link>
          <Link href="/about#takedown" className="hover:underline">Takedown requests</Link>
        </nav>
      </div>
    </footer>
  );
}
