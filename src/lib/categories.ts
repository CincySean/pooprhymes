import type { CategoryId } from "./types";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "poop", label: "Poop", emoji: "💩", blurb: "The main event. Number two, in all its forms." },
  { id: "fart", label: "Farts", emoji: "💨", blurb: "Gas, toots, and silent-but-deadlies." },
  { id: "toilet", label: "Toilets", emoji: "🚽", blurb: "The throne itself, and everything that happens on it." },
  { id: "diarrhea", label: "Diarrhea", emoji: "🌊", blurb: "When it's an emergency." },
  { id: "wiping", label: "Wiping", emoji: "🧻", blurb: "Tissue, toilet paper, and the aftermath." },
  { id: "flush", label: "Flushing", emoji: "🌀", blurb: "Down the drain. Often a metaphor for rivals." },
  { id: "stink", label: "Stink", emoji: "👃", blurb: "Smell-based boasts and insults." },
  { id: "diaper", label: "Diapers", emoji: "🧷", blurb: "Babies, incontinence, and everyone in between." },
  { id: "constipation", label: "Constipation", emoji: "🧱", blurb: "The struggle." },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function isCategoryId(x: string): x is CategoryId {
  return x in CATEGORY_MAP;
}
