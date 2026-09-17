import type { DrinkCategory } from "../types";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/categories";

export default function CategoryPicker({
  value,
  onChange,
}: {
  value: DrinkCategory;
  onChange: (category: DrinkCategory) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Drink category">
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        const selected = value === category;
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={selected}
            data-category={category}
            onClick={() => onChange(category)}
            className="nu-coaster"
          >
            <span className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--ink)" }}>
              <span className="nu-coaster-medallion" aria-hidden="true" />
              {meta.label}
            </span>
            <span className="mt-1 block text-xs" style={{ color: "var(--ink-soft)" }}>
              {meta.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
