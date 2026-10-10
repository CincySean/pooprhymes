import Link from "next/link";
import { SearchBox } from "./SearchBox";

const NAV = [
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/artists", label: "Artists" },
  { href: "/categories/poop", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b-4 border-ink bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="display text-3xl leading-none sm:text-4xl" aria-label="Poop Rhymes home">
          Poop<span className="bar-highlight">Rhymes</span>
        </Link>
        <nav className="order-3 flex w-full gap-x-5 text-sm font-semibold sm:order-2 sm:w-auto" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="py-1 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
          <SearchBox />
          <Link
            href="/submit"
            className="hidden whitespace-nowrap bg-ink px-3 py-2 text-sm font-semibold text-paper hover:bg-stain-deep sm:inline-block"
          >
            Submit a bar
          </Link>
        </div>
      </div>
    </header>
  );
}
