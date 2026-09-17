// Describes this specific drink — never the restaurant as a whole. A
// restaurant's own "what's available here" chips are always derived by
// aggregating the categories of the drinks logged there (see
// lib/restaurantStats.ts), never set directly on the restaurant.
// The internal literal values below ("mocktail-program"/"house-specialty")
// predate this definition and are left as-is to avoid a data migration —
// only their meaning (and display label/description, see lib/categories.ts)
// has changed.
export type DrinkCategory =
  | "basic" // soda, juice, plain lemonade/iced tea
  | "alcohol-free-beer-wine" // NA beer, NA wine, NA sake, etc.
  | "mocktail-program" // an NA riff on a well-known cocktail (Mai Tai, Negroni, G&T, etc.)
  | "house-specialty"; // an original mixed drink with no obvious classic-cocktail equivalent

export interface Restaurant {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  cuisineType?: string;
}

/**
 * A specific commercial NA product used in a drink — e.g. brand "Athletic
 * Brewing", product "Golden Dawn". For an "alcohol-free-beer-wine" entry
 * this is usually the single product being drunk as-is. For a
 * "mocktail-program"/"house-specialty" entry it's the NA spirit(s) used to
 * build it — often more than one (e.g. an NA gin alternative *and* an NA
 * amaro alternative in the same drink).
 */
export interface NAProduct {
  brand: string;
  product: string;
}

export interface DrinkEntry {
  id: string;
  restaurantId: string;
  name: string;
  category: DrinkCategory;
  rating: number; // 1-5, half-steps allowed
  flavorTags: string[]; // e.g. "citrus", "herbal", "smoky", "sweet", "tart", "bitter", "floral", "fruity", "spicy"
  tastingNotes: string; // freeform, user's own words
  ingredients: string[];
  // The specific branded NA products used, when known — distinct from the
  // freeform `ingredients` list above. Empty when not applicable or not known.
  naProducts: NAProduct[];
  isOffMenu?: boolean; // true if you had to ask for it specifically
  notes?: string; // freeform tips, e.g. "ask for it light on syrup"
  // Opt-in: when true, this drink is visible to other accounts — currently
  // only surfaced on a catalog ingredient/spirit detail page ("other
  // tasters also had this at..."), never in another user's own My
  // List/Drinks/Restaurant views. Defaults to false (private). Sharing
  // never grants another account the ability to edit or delete this entry.
  isShared: boolean;
  // Fields that will eventually come from a menu scan — kept on the type now
  // so the UI/form has a place for them, but there is no scanning feature in
  // this build. Left undefined in mock data unless useful.
  //
  // A future menu scan will extract every drink listed on a menu, tasted or
  // not — it must never be assumed that a scanned/listed drink has actually
  // been tried. A DrinkEntry always represents a drink the user has tried
  // and rated; an as-yet-untried scanned menu item is a different, future
  // concept and is out of scope for this build.
  listedDescription?: string;
  listedIngredients?: string[];
  price?: number;
}

// ---------------------------------------------------------------------------
// Ingredient/spirit catalog — a shared reference layer, separate from the
// freeform text a drink entry stores. When an ingredient or NA product is
// logged (by hand today, by a future menu scan later), it gets resolved
// against this catalog: matched to an existing entry if one's a close
// enough match, or added as a new one. See src/data/catalog.ts.
//
// This is what will eventually let drinks be searched/filtered by
// ingredient/spirit category, and let a future "what's in my pantry"
// feature check what a drink needs against what the user has on hand.

/** Every ingredient gets *some* type — falls back to "other" when unsure. */
export type IngredientCategory =
  | "citrus"
  | "produce" // fruit/veg that isn't citrus, e.g. cucumber, apple
  | "herb_spice"
  | "soda_mixer" // tonic, soda water, ginger ale, cola, etc.
  | "juice"
  | "syrup_sweetener"
  | "bitters"
  | "dairy_alt"
  | "tea_coffee"
  | "garnish"
  | "water"
  | "other";

/** Not every NA product has an obvious alcoholic equivalent — hence optional. */
export type SpiritCategory =
  | "gin"
  | "vodka"
  | "whiskey"
  | "rum"
  | "tequila_mezcal"
  | "amaro_bitter_liqueur"
  | "wine"
  | "sparkling_wine"
  | "beer"
  | "sake"
  | "vermouth"
  | "aperitif"
  | "liqueur"
  | "other";

export interface CatalogIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
}

export interface CatalogSpirit {
  id: string;
  brand: string;
  product: string;
  category: SpiritCategory | null;
}

/** A drink entry paired with its restaurant — used on catalog detail pages,
 * for both "your drinks" and "other tasters'" matches (the latter possibly
 * pointing at a restaurant that belongs to a different account; restaurant
 * visibility follows the same sharing rule as the drink itself). */
export interface DrinkWithRestaurant {
  entry: DrinkEntry;
  restaurant: Restaurant;
}
