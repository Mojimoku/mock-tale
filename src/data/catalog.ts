import type {
  CatalogIngredient,
  CatalogSpirit,
  DrinkWithRestaurant,
  IngredientCategory,
  NAProduct,
  SpiritCategory,
} from "../types";
import { supabase } from "./supabaseClient";
import { guessIngredientCategory, guessSpiritCategory } from "../lib/categorize";
import { normalizeCatalogName } from "../lib/normalizeCatalogName";
import { mapDrinkEntry, mapRestaurant, requireUserId } from "./dataProvider";
import type { Tables } from "./database.types";

/**
 * The ingredient/spirit catalog — a shared, global reference layer
 * (unlike restaurants/drink_entries, not scoped to a user: "lime" means
 * the same thing for everyone). This module is the only place that talks
 * to the `catalog_ingredients`/`catalog_spirits` tables, their
 * `resolve_catalog_*` RPCs, and the `drink_ingredient_links`/
 * `drink_spirit_links` junction tables that connect a drink entry to the
 * catalog entries it uses.
 *
 * Two kinds of callers:
 * - The manual ingredient/NA-product entry fields (and a future menu-scan
 *   feature) resolve freeform text to a catalog entry as it's typed.
 * - A catalog detail page (`/ingredients/:id`, `/spirits/:id`) reads back
 *   "your drinks" and "other tasters' drinks" that use it — the latter
 *   only including drinks their owner explicitly marked shared (see
 *   `DrinkEntry.isShared`). Both queries stay in this file since they need
 *   the junction tables; dataProvider.ts's own reads stay strictly
 *   owner-scoped and never reach into another account's data.
 */

type RestaurantRow = Tables<"restaurants">;
type DrinkEntryRow = Tables<"drink_entries">;

function mapIngredient(row: Tables<"catalog_ingredients">): CatalogIngredient {
  return {
    id: row.id,
    name: row.name,
    category: row.category as IngredientCategory,
  };
}

function mapSpirit(row: Tables<"catalog_spirits">): CatalogSpirit {
  return {
    id: row.id,
    brand: row.brand,
    product: row.product,
    category: row.category as SpiritCategory | null,
  };
}

// ---- Resolution -------------------------------------------------------------

/**
 * Resolve a freeform ingredient name to a catalog entry: matches an
 * existing entry (exact or a close edit-distance match, tolerant of
 * typos/OCR noise/plurals) or creates a new one, guessing its category
 * from the name. The guess is only used if a new row is actually created —
 * an existing match keeps whatever category it already has.
 */
export async function resolveIngredient(rawName: string): Promise<CatalogIngredient> {
  const name = rawName.trim();
  const { data, error } = await supabase.rpc("resolve_catalog_ingredient", {
    p_name: name,
    p_category: guessIngredientCategory(name),
  });
  if (error) throw error;
  return mapIngredient(data);
}

/**
 * Resolve a freeform brand/product pair to a catalog entry, guessing its
 * presumptive alcoholic-equivalent category (or leaving it uncategorized
 * if none is apparent) when creating a new one.
 */
export async function resolveSpirit(rawBrand: string, rawProduct: string): Promise<CatalogSpirit> {
  const brand = rawBrand.trim();
  const product = rawProduct.trim();
  const { data, error } = await supabase.rpc("resolve_catalog_spirit", {
    p_brand: brand,
    p_product: product,
    p_category: guessSpiritCategory(brand, product) ?? undefined,
  });
  if (error) throw error;
  return mapSpirit(data);
}

// ---- Browsing -----------------------------------------------------------

/** All catalog ingredients, alphabetical. */
export async function getCatalogIngredients(): Promise<CatalogIngredient[]> {
  const { data, error } = await supabase.from("catalog_ingredients").select("*").order("name");
  if (error) throw error;
  return data.map(mapIngredient);
}

/** All catalog spirits, alphabetical by brand. */
export async function getCatalogSpirits(): Promise<CatalogSpirit[]> {
  const { data, error } = await supabase.from("catalog_spirits").select("*").order("brand");
  if (error) throw error;
  return data.map(mapSpirit);
}

export async function getCatalogIngredient(id: string): Promise<CatalogIngredient | undefined> {
  const { data, error } = await supabase.from("catalog_ingredients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapIngredient(data) : undefined;
}

export async function getCatalogSpirit(id: string): Promise<CatalogSpirit | undefined> {
  const { data, error } = await supabase.from("catalog_spirits").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapSpirit(data) : undefined;
}

/**
 * Name -> id lookup maps for the whole catalog, keyed the same way
 * `normalizeCatalogName` normalizes drink-card chip text — lets a page
 * resolve which of its chips can link to a detail page without a fetch
 * per card. See the limitation noted on `normalizeCatalogName` itself.
 */
export async function getCatalogLookupMaps(): Promise<{
  ingredientIdsByName: Map<string, string>;
  spiritIdsByName: Map<string, string>;
}> {
  const [ingredients, spirits] = await Promise.all([getCatalogIngredients(), getCatalogSpirits()]);
  return {
    ingredientIdsByName: new Map(ingredients.map((i) => [normalizeCatalogName(i.name), i.id])),
    spiritIdsByName: new Map(spirits.map((s) => [normalizeCatalogName(`${s.brand} ${s.product}`), s.id])),
  };
}

// ---- Linking a saved drink to the catalog entries it uses ----------------

interface JoinedDrinkRow {
  drink_entries: DrinkEntryRow & { restaurants: RestaurantRow };
}

function mapJoinedDrinkRows(rows: JoinedDrinkRow[]): DrinkWithRestaurant[] {
  return rows.map((row) => ({
    entry: mapDrinkEntry(row.drink_entries),
    restaurant: mapRestaurant(row.drink_entries.restaurants),
  }));
}

/**
 * Re-resolves the given ingredient names against the catalog and syncs
 * `drink_ingredient_links` to exactly match them — called after a drink is
 * saved (create or edit), once its id exists. Deletes+re-inserts rather
 * than diffing, since a drink rarely has more than a handful of
 * ingredients. Best-effort from the caller's perspective (catalog linking
 * enriches the app, it isn't why the drink itself was saved) but awaited
 * here so the detail page reliably reflects the latest save.
 */
export async function syncDrinkIngredientLinks(drinkEntryId: string, ingredientNames: string[]): Promise<void> {
  const resolved = await Promise.all(ingredientNames.map((name) => resolveIngredient(name)));
  const uniqueIds = [...new Set(resolved.map((entry) => entry.id))];

  const { error: deleteError } = await supabase
    .from("drink_ingredient_links")
    .delete()
    .eq("drink_entry_id", drinkEntryId);
  if (deleteError) throw deleteError;

  if (uniqueIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("drink_ingredient_links")
    .insert(uniqueIds.map((catalogIngredientId) => ({ drink_entry_id: drinkEntryId, catalog_ingredient_id: catalogIngredientId })));
  if (insertError) throw insertError;
}

/** Same as `syncDrinkIngredientLinks`, for the NA brand/product list. */
export async function syncDrinkSpiritLinks(drinkEntryId: string, products: NAProduct[]): Promise<void> {
  const resolved = await Promise.all(products.map((product) => resolveSpirit(product.brand, product.product)));
  const uniqueIds = [...new Set(resolved.map((entry) => entry.id))];

  const { error: deleteError } = await supabase
    .from("drink_spirit_links")
    .delete()
    .eq("drink_entry_id", drinkEntryId);
  if (deleteError) throw deleteError;

  if (uniqueIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("drink_spirit_links")
    .insert(uniqueIds.map((catalogSpiritId) => ({ drink_entry_id: drinkEntryId, catalog_spirit_id: catalogSpiritId })));
  if (insertError) throw insertError;
}

// ---- Catalog detail page: which drinks use this? --------------------------

/** Your own drinks that use the given catalog ingredient. */
export async function getMyDrinksForIngredient(catalogIngredientId: string): Promise<DrinkWithRestaurant[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("drink_ingredient_links")
    .select("drink_entries!inner(*, restaurants!inner(*))")
    .eq("catalog_ingredient_id", catalogIngredientId)
    .eq("drink_entries.user_id", userId);
  if (error) throw error;
  return mapJoinedDrinkRows((data ?? []) as unknown as JoinedDrinkRow[]);
}

/** Other accounts' *shared* drinks that use the given catalog ingredient (never your own — see `getMyDrinksForIngredient`). */
export async function getSharedDrinksForIngredient(catalogIngredientId: string): Promise<DrinkWithRestaurant[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("drink_ingredient_links")
    .select("drink_entries!inner(*, restaurants!inner(*))")
    .eq("catalog_ingredient_id", catalogIngredientId)
    .eq("drink_entries.is_shared", true)
    .neq("drink_entries.user_id", userId);
  if (error) throw error;
  return mapJoinedDrinkRows((data ?? []) as unknown as JoinedDrinkRow[]);
}

/** Your own drinks that use the given catalog spirit/NA product. */
export async function getMyDrinksForSpirit(catalogSpiritId: string): Promise<DrinkWithRestaurant[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("drink_spirit_links")
    .select("drink_entries!inner(*, restaurants!inner(*))")
    .eq("catalog_spirit_id", catalogSpiritId)
    .eq("drink_entries.user_id", userId);
  if (error) throw error;
  return mapJoinedDrinkRows((data ?? []) as unknown as JoinedDrinkRow[]);
}

/** Other accounts' *shared* drinks that use the given catalog spirit/NA product. */
export async function getSharedDrinksForSpirit(catalogSpiritId: string): Promise<DrinkWithRestaurant[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("drink_spirit_links")
    .select("drink_entries!inner(*, restaurants!inner(*))")
    .eq("catalog_spirit_id", catalogSpiritId)
    .eq("drink_entries.is_shared", true)
    .neq("drink_entries.user_id", userId);
  if (error) throw error;
  return mapJoinedDrinkRows((data ?? []) as unknown as JoinedDrinkRow[]);
}
