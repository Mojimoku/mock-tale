import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DrinkEntry, Restaurant } from "../types";
import { getDrinkEntries, getRestaurants } from "../data/dataProvider";
import { getCatalogLookupMaps } from "../data/catalog";
import { DEFAULT_FILTERS, hasActiveFilters } from "../lib/filterRestaurants";
import { filterAndSortDrinks } from "../lib/filterDrinks";
import PageContainer from "../components/PageContainer";
import SearchFilterBar from "../components/SearchFilterBar";
import DrinkCard from "../components/DrinkCard";
import DrinkCardSkeleton from "../components/DrinkCardSkeleton";
import EmptyState from "../components/EmptyState";
import AddDrinkFab from "../components/AddDrinkFab";
import { GlassIcon, XIcon } from "../components/icons";

/**
 * The flat, drink-first counterpart to My List: every drink you've logged,
 * independent of which restaurant it's from — the natural home for
 * filtering by category/flavor across your whole log rather than one
 * restaurant at a time.
 */
export default function DrinksPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [drinkEntries, setDrinkEntries] = useState<DrinkEntry[]>([]);
  const [catalogLookup, setCatalogLookup] = useState<{
    ingredientIdsByName: Map<string, string>;
    spiritIdsByName: Map<string, string>;
  }>({ ingredientIdsByName: new Map(), spiritIdsByName: new Map() });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([getRestaurants(), getDrinkEntries(), getCatalogLookupMaps()])
      .then(([restaurantList, entries, lookup]) => {
        if (cancelled) return;
        setRestaurants(restaurantList);
        setDrinkEntries(entries);
        setCatalogLookup(lookup);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = filterAndSortDrinks(drinkEntries, restaurants, filters);
  const filtersActive = hasActiveFilters(filters);
  const activeFilterCount =
    filters.categories.length + filters.flavorTags.length + (filters.minRating > 0 ? 1 : 0);

  return (
    <PageContainer>
      <header className="nu-header">
        <h1 className="font-display text-xl" style={{ color: "var(--ink)" }}>
          Drinks
        </h1>
        <p className="nu-subtitle text-xs">Every NA drink you've logged, across every restaurant</p>
      </header>

      <SearchFilterBar filters={filters} onChange={setFilters} activeFilterCount={activeFilterCount} />

      <main className="space-y-3 px-4 py-4 pb-32">
        {status === "loading" && (
          <>
            <DrinkCardSkeleton />
            <DrinkCardSkeleton />
            <DrinkCardSkeleton />
          </>
        )}

        {status === "error" && (
          <EmptyState
            title="Couldn't load your drinks"
            description="Something went wrong loading your data. Try reloading the page."
          />
        )}

        {status === "ready" && drinkEntries.length === 0 && (
          <EmptyState
            icon={<GlassIcon className="h-6 w-6" />}
            title="No drinks yet"
            description="Log your first drink to start building your list."
            action={
              <Link to="/drinks/new" className="nu-btn nu-btn-primary px-4 py-2 text-sm">
                Log a drink
              </Link>
            }
          />
        )}

        {status === "ready" && drinkEntries.length > 0 && ranked.length === 0 && (
          <EmptyState
            icon={<XIcon className="h-6 w-6" />}
            title="No matches"
            description={
              filtersActive ? "Try adjusting your search or filters." : "No drinks match your search."
            }
            action={
              filtersActive ? (
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="nu-btn nu-btn-ghost px-4 py-2 text-sm"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        )}

        {status === "ready" &&
          ranked.map(({ entry, restaurant }) => (
            <DrinkCard
              key={entry.id}
              entry={entry}
              restaurantName={restaurant?.name}
              ingredientCatalogIds={catalogLookup.ingredientIdsByName}
              spiritCatalogIds={catalogLookup.spiritIdsByName}
            />
          ))}
      </main>

      <AddDrinkFab to="/drinks/new" />
    </PageContainer>
  );
}
