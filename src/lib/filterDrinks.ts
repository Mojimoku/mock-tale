import type { DrinkEntry, Restaurant } from "../types";
import type { RestaurantFilters } from "./filterRestaurants";

export interface RankedDrink {
  entry: DrinkEntry;
  restaurant: Restaurant | undefined;
}

/**
 * The flat, drink-first counterpart to filterAndSortRestaurants — same
 * filter shape (reused as-is: category/flavor/rating are drink-level
 * either way), but applied directly to entries rather than to the
 * restaurants that contain them. "search" also matches the drink's own
 * name here, not just its restaurant.
 */
export function filterAndSortDrinks(
  entries: DrinkEntry[],
  restaurants: Restaurant[],
  filters: RestaurantFilters,
): RankedDrink[] {
  const restaurantById = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]));
  const searchTerm = filters.search.trim().toLowerCase();

  return entries
    .filter((entry) => {
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
      if (searchTerm) {
        const restaurant = restaurantById.get(entry.restaurantId);
        const haystack = `${entry.name} ${restaurant?.name ?? ""} ${restaurant?.neighborhood ?? ""}`.toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }
      return true;
    })
    .map((entry) => ({ entry, restaurant: restaurantById.get(entry.restaurantId) }))
    .sort((a, b) => b.entry.rating - a.entry.rating);
}
