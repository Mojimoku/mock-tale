import type { DrinkCategory, DrinkEntry, Restaurant } from "../types";
import { computeRestaurantStats, type RestaurantStats } from "./restaurantStats";

export interface RestaurantFilters {
  /** Matches against restaurant name or neighborhood. */
  search: string;
  /** Empty = any category. */
  categories: DrinkCategory[];
  /** Empty = any flavor. */
  flavorTags: string[];
  /** 0 = no minimum. */
  minRating: number;
}

export const DEFAULT_FILTERS: RestaurantFilters = {
  search: "",
  categories: [],
  flavorTags: [],
  minRating: 0,
};

export function hasActiveFilters(filters: RestaurantFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.categories.length > 0 ||
    filters.flavorTags.length > 0 ||
    filters.minRating > 0
  );
}

export interface RankedRestaurant {
  restaurant: Restaurant;
  stats: RestaurantStats;
}

/**
 * Applies search + drink-level filters to the restaurant list, then sorts by
 * highest-rated drink descending (restaurants with no logged drinks sink to
 * the bottom). A restaurant matches the category/tag/rating filters if *any*
 * of its logged drinks satisfies all of them at once.
 */
export function filterAndSortRestaurants(
  restaurants: Restaurant[],
  drinkEntries: DrinkEntry[],
  filters: RestaurantFilters,
): RankedRestaurant[] {
  const entriesByRestaurant = new Map<string, DrinkEntry[]>();
  for (const entry of drinkEntries) {
    const list = entriesByRestaurant.get(entry.restaurantId);
    if (list) list.push(entry);
    else entriesByRestaurant.set(entry.restaurantId, [entry]);
  }

  const searchTerm = filters.search.trim().toLowerCase();
  const hasDrinkLevelFilters =
    filters.categories.length > 0 || filters.flavorTags.length > 0 || filters.minRating > 0;

  return restaurants
    .filter((restaurant) => {
      if (searchTerm) {
        const haystack = `${restaurant.name} ${restaurant.neighborhood}`.toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }

      if (hasDrinkLevelFilters) {
        const entries = entriesByRestaurant.get(restaurant.id) ?? [];
        const hasQualifyingDrink = entries.some((entry) => {
          if (filters.categories.length > 0 && !filters.categories.includes(entry.category)) {
            return false;
          }
          if (
            filters.flavorTags.length > 0 &&
            !filters.flavorTags.some((tag) => entry.flavorTags.includes(tag))
          ) {
            return false;
          }
          if (filters.minRating > 0 && entry.rating < filters.minRating) {
            return false;
          }
          return true;
        });
        if (!hasQualifyingDrink) return false;
      }

      return true;
    })
    .map((restaurant) => ({
      restaurant,
      stats: computeRestaurantStats(entriesByRestaurant.get(restaurant.id) ?? []),
    }))
    .sort((a, b) => (b.stats.bestRating ?? -1) - (a.stats.bestRating ?? -1));
}
