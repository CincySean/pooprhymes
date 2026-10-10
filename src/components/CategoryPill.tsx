import Link from "next/link";
import { CATEGORY_MAP } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

export function CategoryPill({ id, active = false }: { id: CategoryId; active?: boolean }) {
  const c = CATEGORY_MAP[id];
  return (
    <Link
      href={`/categories/${id}`}
      className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-0.5 text-sm font-semibold ${
        active ? "bg-ink text-paper" : "bg-paper hover:bg-stain"
      }`}
    >
      <span aria-hidden="true">{c.emoji}</span>
      {c.label}
    </Link>
  );
}
