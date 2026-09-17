import { useState } from "react";
import type { DrinkCategory } from "../types";
import type { RestaurantFilters } from "../lib/filterRestaurants";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/categories";
import { FLAVOR_TAGS } from "../lib/flavorTags";
import { SearchIcon, SlidersIcon, XIcon } from "./icons";

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5];

export default function SearchFilterBar({
  filters,
  onChange,
  activeFilterCount,
}: {
  filters: RestaurantFilters;
  onChange: (filters: RestaurantFilters) => void;
  activeFilterCount: number;
}) {
  const [showFilters, setShowFilters] = useState(false);

  function toggleCategory(category: DrinkCategory) {
    const has = filters.categories.includes(category);
    onChange({
      ...filters,
      categories: has
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  }

  function toggleFlavorTag(tag: string) {
    const has = filters.flavorTags.includes(tag);
    onChange({
      ...filters,
      flavorTags: has ? filters.flavorTags.filter((t) => t !== tag) : [...filters.flavorTags, tag],
    });
  }

  function clearAll() {
    onChange({ search: filters.search, categories: [], flavorTags: [], minRating: 0 });
  }

  return (
    <div className="px-4 pb-3 pt-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--ink-faint)" }}
          />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Search by restaurant or neighborhood"
            className="nu-input text-sm"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-pressed={showFilters || activeFilterCount > 0}
          aria-label="Toggle filters"
          className="nu-icon-btn"
        >
          <SlidersIcon className="h-4 w-4" />
          {activeFilterCount > 0 && <span className="nu-icon-btn-count">{activeFilterCount}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 space-y-3">
          <div>
            <p className="nu-filter-label mb-1.5">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_ORDER.map((category) => {
                const meta = CATEGORY_META[category];
                const selected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    data-category={category}
                    onClick={() => toggleCategory(category)}
                    className="nu-badge-btn"
                  >
                    <span className="nu-badge-dot" aria-hidden="true" />
                    {meta.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="nu-filter-label mb-1.5">Flavor</p>
            <div className="flex flex-wrap gap-1.5">
              {FLAVOR_TAGS.map((tag) => {
                const selected = filters.flavorTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleFlavorTag(tag)}
                    className="nu-chip nu-chip-btn"
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="nu-filter-label mb-1.5">Minimum rating</p>
            <div className="flex flex-wrap gap-1.5">
              {RATING_OPTIONS.map((rating) => {
                const selected = filters.minRating === rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ ...filters, minRating: rating })}
                    className="nu-chip nu-chip-btn"
                  >
                    {rating === 0 ? "Any" : `${rating}+`}
                  </button>
                );
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: "var(--ink-soft)" }}
            >
              <XIcon className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
