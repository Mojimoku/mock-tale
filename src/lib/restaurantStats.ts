import type { DrinkCategory, DrinkEntry } from "../types";
import { CATEGORY_ORDER } from "./categories";

export interface RestaurantStats {
  drinkCount: number;
  bestRating: number | null;
  bestDrinkName: string | null;
  /** Distinct categories logged at this restaurant, in canonical order. */
  categories: DrinkCategory[];
}

export function computeRestaurantStats(entries: DrinkEntry[]): RestaurantStats {
  if (entries.length === 0) {
    return { drinkCount: 0, bestRating: null, bestDrinkName: null, categories: [] };
  }

  const best = entries.reduce((a, b) => (b.rating > a.rating ? b : a));
  const present = new Set(entries.map((entry) => entry.category));

  return {
    drinkCount: entries.length,
    bestRating: best.rating,
    bestDrinkName: best.name,
    categories: CATEGORY_ORDER.filter((category) => present.has(category)),
  };
}
