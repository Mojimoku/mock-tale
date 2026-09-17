import type { DrinkCategory } from "../types";

export interface CategoryMeta {
  label: string;
  shortLabel: string;
  description: string;
}

// Category describes *this specific drink* — never the restaurant. A
// restaurant's own category chips (see restaurantStats.ts) are only ever
// derived by aggregating the categories of the drinks logged there, never
// set directly. Colors live in CSS (index.css, keyed by data-category) —
// "basic" deliberately stays a plain neutral tone since it's soda/lemonade,
// while the other three carry pastel hues.
export const CATEGORY_META: Record<DrinkCategory, CategoryMeta> = {
  basic: {
    label: "Basic",
    shortLabel: "Basic",
    description: "Soda, juice, plain lemonade or iced tea",
  },
  "alcohol-free-beer-wine": {
    label: "NA Beer & Wine",
    shortLabel: "Beer & Wine",
    description: "NA beer, NA wine, NA sake, etc.",
  },
  "mocktail-program": {
    label: "Mocktail",
    shortLabel: "Mocktail",
    description: "An NA riff on a well-known cocktail — Mai Tai, Negroni, G&T, etc.",
  },
  "house-specialty": {
    label: "Signature Drink",
    shortLabel: "Signature",
    description: "An original mixed drink with no obvious classic-cocktail equivalent",
  },
};

/** Canonical display order, worst-program to best-program. */
export const CATEGORY_ORDER: DrinkCategory[] = [
  "basic",
  "alcohol-free-beer-wine",
  "mocktail-program",
  "house-specialty",
];
