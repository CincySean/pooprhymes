import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20">
      <h1 className="display text-6xl sm:text-8xl">Nothing here</h1>
      <p className="mt-4 text-lg text-mute">Flushed, moved, or never existed.</p>
      <Link href="/" className="mt-6 inline-block bg-ink px-4 py-2 font-semibold text-paper hover:bg-stain-deep">
        Back to the front page
      </Link>
    </div>
  );
}
