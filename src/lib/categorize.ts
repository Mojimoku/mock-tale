import type { IngredientCategory, SpiritCategory } from "../types";

/**
 * Keyword-based category guesses, used only when the catalog resolver is
 * about to *create* a new entry (an existing match always keeps whatever
 * category it already has — these heuristics never override a curated
 * value). Ordered lists: first matching category wins, so put more
 * specific keywords before more general ones.
 */

const INGREDIENT_RULES: { category: IngredientCategory; keywords: string[] }[] = [
  { category: "soda_mixer", keywords: ["tonic", "soda water", "club soda", "ginger ale", "ginger beer", "cola", "sprite", "seltzer", "carbonated"] },
  { category: "syrup_sweetener", keywords: ["syrup", "honey", "agave", "grenadine", "cordial", "sugar"] },
  { category: "bitters", keywords: ["bitters"] },
  { category: "tea_coffee", keywords: ["tea", "coffee", "espresso", "matcha"] },
  { category: "dairy_alt", keywords: ["milk", "cream"] },
  { category: "juice", keywords: ["juice"] },
  { category: "citrus", keywords: ["lime", "lemon", "orange", "grapefruit", "yuzu", "citrus"] },
  { category: "garnish", keywords: ["garnish", "wheel", "twist", "zest", "sprig", "rim"] },
  { category: "herb_spice", keywords: ["mint", "basil", "rosemary", "thyme", "sage", "ginger", "turmeric", "cinnamon", "clove", "pepper", "spice", "herb", "flower"] },
  { category: "produce", keywords: ["cucumber", "apple", "pineapple", "berry", "cherry", "peach", "pear", "mango", "melon", "fruit"] },
  { category: "water", keywords: ["water", "ice"] },
];

/** Every ingredient gets *some* category — falls back to "other". */
export function guessIngredientCategory(name: string): IngredientCategory {
  const lower = name.toLowerCase();
  for (const rule of INGREDIENT_RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.category;
    }
  }
  return "other";
}

const SPIRIT_RULES: { category: SpiritCategory; keywords: string[] }[] = [
  { category: "sparkling_wine", keywords: ["sparkling", "champagne", "prosecco", "cava"] },
  { category: "wine", keywords: ["wine", "rosé", "rose", "cabernet", "chardonnay", "sauvignon", "pinot", "merlot"] },
  { category: "beer", keywords: ["beer", "ipa", "lager", "pilsner", "stout", "porter"] },
  { category: "sake", keywords: ["sake"] },
  { category: "gin", keywords: ["gin"] },
  { category: "vodka", keywords: ["vodka"] },
  { category: "whiskey", keywords: ["whiskey", "whisky", "bourbon", "scotch", "rye"] },
  { category: "rum", keywords: ["rum"] },
  { category: "tequila_mezcal", keywords: ["tequila", "mezcal"] },
  { category: "vermouth", keywords: ["vermouth"] },
  { category: "amaro_bitter_liqueur", keywords: ["amaro", "campari", "aperol", "bitter"] },
  { category: "aperitif", keywords: ["aperitif", "spritz"] },
  { category: "liqueur", keywords: ["liqueur", "schnapps"] },
];

/** Not every NA product has an obvious alcoholic equivalent — null when none is apparent. */
export function guessSpiritCategory(brand: string, product: string): SpiritCategory | null {
  const lower = `${brand} ${product}`.toLowerCase();
  for (const rule of SPIRIT_RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.category;
    }
  }
  return null;
}
