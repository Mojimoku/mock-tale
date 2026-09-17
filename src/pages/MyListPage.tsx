import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DrinkEntry, Restaurant } from "../types";
import { getDrinkEntries, getRestaurants } from "../data/dataProvider";
import { DEFAULT_FILTERS, filterAndSortRestaurants, hasActiveFilters } from "../lib/filterRestaurants";
import PageContainer from "../components/PageContainer";
import SearchFilterBar from "../components/SearchFilterBar";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantCardSkeleton from "../components/RestaurantCardSkeleton";
import EmptyState from "../components/EmptyState";
import AddDrinkFab from "../components/AddDrinkFab";
import { CupIcon, LogOutIcon, XIcon } from "../components/icons";
import { useAuth } from "../auth/auth-context-types";
import BrandMark from "../components/BrandMark";
import Wordmark from "../components/Wordmark";

export default function MyListPage() {
  const { user, signOut } = useAuth();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [drinkEntries, setDrinkEntries] = useState<DrinkEntry[]>([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([getRestaurants(), getDrinkEntries()])
      .then(([restaurantList, entries]) => {
        if (cancelled) return;
        setRestaurants(restaurantList);
        setDrinkEntries(entries);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = filterAndSortRestaurants(restaurants, drinkEntries, filters);
  const filtersActive = hasActiveFilters(filters);
  const activeFilterCount =
    filters.categories.length + filters.flavorTags.length + (filters.minRating > 0 ? 1 : 0);

  return (
    <PageContainer>
      <header className="nu-header">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div>
              <h1 className="text-xl">
                <Wordmark />
              </h1>
              <p className="nu-subtitle text-xs">Your trusted list of NA drinks worth ordering</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            title={user?.email ? `Sign out (${user.email})` : "Sign out"}
            className="nu-icon-btn mt-0.5 shrink-0"
            aria-label="Sign out"
          >
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <SearchFilterBar filters={filters} onChange={setFilters} activeFilterCount={activeFilterCount} />

      <main className="space-y-3 px-4 py-4 pb-32">
        {status === "loading" && (
          <>
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
          </>
        )}

        {status === "error" && (
          <EmptyState
            title="Couldn't load your list"
            description="Something went wrong loading your data. Try reloading the page."
          />
        )}

        {status === "ready" && restaurants.length === 0 && (
          <EmptyState
            icon={<CupIcon className="h-6 w-6" />}
            title="No restaurants yet"
            description="Log your first drink to start building your trusted list."
            action={
              <Link to="/drinks/new" className="nu-btn nu-btn-primary px-4 py-2 text-sm">
                Log a drink
              </Link>
            }
          />
        )}

        {status === "ready" && restaurants.length > 0 && ranked.length === 0 && (
          <EmptyState
            icon={<XIcon className="h-6 w-6" />}
            title="No matches"
            description={
              filtersActive
                ? "Try adjusting your search or filters."
                : "No restaurants match your search."
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
          ranked.map(({ restaurant, stats }) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} stats={stats} />
          ))}
      </main>

      <AddDrinkFab to="/drinks/new" />
    </PageContainer>
  );
}
