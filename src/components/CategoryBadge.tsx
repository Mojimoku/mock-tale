import type { DrinkCategory } from "../types";
import { CATEGORY_META } from "../lib/categories";

export default function CategoryBadge({
  category,
  short = false,
  className = "",
}: {
  category: DrinkCategory;
  short?: boolean;
  className?: string;
}) {
  const meta = CATEGORY_META[category];
  return (
    <span className={`nu-badge ${className}`} data-category={category}>
      <span className="nu-badge-dot" aria-hidden="true" />
      {short ? meta.shortLabel : meta.label}
    </span>
  );
}
