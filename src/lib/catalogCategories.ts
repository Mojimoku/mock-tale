import type { IngredientCategory, SpiritCategory } from "../types";

/** Display labels — keep in sync with the DB check constraints (see the
 * `create_ingredient_spirit_catalog` migration) and with the heuristics in
 * `categorize.ts`. */
export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  citrus: "Citrus",
  produce: "Produce",
  herb_spice: "Herb & Spice",
  soda_mixer: "Soda & Mixer",
  juice: "Juice",
  syrup_sweetener: "Syrup & Sweetener",
  bitters: "Bitters",
  dairy_alt: "Dairy & Alt-Milk",
  tea_coffee: "Tea & Coffee",
  garnish: "Garnish",
  water: "Water",
  other: "Other",
};

export const INGREDIENT_CATEGORY_ORDER: IngredientCategory[] = [
  "citrus",
  "produce",
  "herb_spice",
  "soda_mixer",
  "juice",
  "syrup_sweetener",
  "bitters",
  "dairy_alt",
  "tea_coffee",
  "garnish",
  "water",
  "other",
];

/** Presumptive alcoholic equivalent — what this NA product stands in for. */
export const SPIRIT_CATEGORY_LABELS: Record<SpiritCategory, string> = {
  gin: "Gin",
  vodka: "Vodka",
  whiskey: "Whiskey",
  rum: "Rum",
  tequila_mezcal: "Tequila & Mezcal",
  amaro_bitter_liqueur: "Amaro & Bitter Liqueur",
  wine: "Wine",
  sparkling_wine: "Sparkling Wine",
  beer: "Beer",
  sake: "Sake",
  vermouth: "Vermouth",
  aperitif: "Aperitif",
  liqueur: "Liqueur",
  other: "Other",
};

export const SPIRIT_CATEGORY_ORDER: SpiritCategory[] = [
  "beer",
  "wine",
  "sparkling_wine",
  "sake",
  "gin",
  "vodka",
  "whiskey",
  "rum",
  "tequila_mezcal",
  "vermouth",
  "aperitif",
  "amaro_bitter_liqueur",
  "liqueur",
  "other",
];
