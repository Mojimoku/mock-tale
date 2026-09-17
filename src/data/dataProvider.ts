import type { DrinkEntry, NAProduct, Restaurant } from "../types";
import { supabase } from "./supabaseClient";
import type { Tables, TablesInsert } from "./database.types";

/**
 * mock/tale's data provider.
 *
 * This is the *only* module that knows where data actually lives — every
 * component reads and writes through the functions exported here instead of
 * talking to Supabase directly. Backed by the `restaurants` and
 * `drink_entries` tables in the mock/tale Supabase project; row <-> domain-type
 * mapping happens only in this file, so the rest of the app only ever sees
 * `Restaurant`/`DrinkEntry` as defined in `src/types.ts`.
 *
 * A drink can be marked "shared" (see `DrinkEntry.isShared`), which relaxes
 * *database* read access to it for other accounts — but everything in this
 * file stays strictly scoped to the signed-in user's own rows regardless
 * (explicit `user_id` filters below, not just RLS). "My List"/"Drinks"/a
 * restaurant's own detail page must only ever show what's actually yours;
 * cross-account visibility is a distinct, narrower feature handled entirely
 * by `src/data/catalog.ts`'s "other tasters" queries.
 */

type RestaurantRow = Tables<"restaurants">;
type DrinkEntryRow = Tables<"drink_entries">;

export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const userId = data.session?.user.id;
  if (!userId) throw new Error("Not signed in");
  return userId;
}

// Exported so catalog.ts can map the same row shapes consistently when it
// joins drink_entries/restaurants for its cross-account "other tasters"
// queries — the mapping logic itself should only live in one place.
export function mapRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    neighborhood: row.neighborhood,
    city: row.city,
    cuisineType: row.cuisine_type ?? undefined,
  };
}

export function mapDrinkEntry(row: DrinkEntryRow): DrinkEntry {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    category: row.category as DrinkEntry["category"],
    rating: Number(row.rating),
    flavorTags: row.flavor_tags,
    tastingNotes: row.tasting_notes,
    ingredients: row.ingredients,
    naProducts: (row.na_products as unknown as NAProduct[] | null) ?? [],
    isOffMenu: row.is_off_menu || undefined,
    isShared: row.is_shared,
    notes: row.notes ?? undefined,
    listedDescription: row.listed_description ?? undefined,
    listedIngredients: row.listed_ingredients ?? undefined,
    price: row.price === null ? undefined : Number(row.price),
  };
}

function toDrinkEntryInsert(input: Omit<DrinkEntry, "id">): TablesInsert<"drink_entries"> {
  return {
    restaurant_id: input.restaurantId,
    name: input.name,
    category: input.category,
    rating: input.rating,
    flavor_tags: input.flavorTags,
    tasting_notes: input.tastingNotes,
    ingredients: input.ingredients,
    na_products: input.naProducts as unknown as TablesInsert<"drink_entries">["na_products"],
    is_off_menu: input.isOffMenu ?? false,
    is_shared: input.isShared,
    notes: input.notes ?? null,
    listed_description: input.listedDescription ?? null,
    listed_ingredients: input.listedIngredients ?? null,
    price: input.price ?? null,
  };
}

// ---- Restaurants ----------------------------------------------------------

export async function getRestaurants(): Promise<Restaurant[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data.map(mapRestaurant);
}

export async function getRestaurant(id: string): Promise<Restaurant | undefined> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRestaurant(data) : undefined;
}

export async function addRestaurant(input: Omit<Restaurant, "id">): Promise<Restaurant> {
  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      name: input.name,
      neighborhood: input.neighborhood,
      city: input.city,
      cuisine_type: input.cuisineType ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRestaurant(data);
}

// ---- Drink entries ----------------------------------------------------------

/** All of *your* drink entries, or only those for one restaurant when `restaurantId` is given. */
export async function getDrinkEntries(restaurantId?: string): Promise<DrinkEntry[]> {
  const userId = await requireUserId();
  let query = supabase.from("drink_entries").select("*").eq("user_id", userId).order("created_at");
  if (restaurantId) query = query.eq("restaurant_id", restaurantId);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapDrinkEntry);
}

/** One of *your* drink entries — never another account's, shared or not (that's what keeps the edit form from ever loading a drink you don't own). */
export async function getDrinkEntry(id: string): Promise<DrinkEntry | undefined> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("drink_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDrinkEntry(data) : undefined;
}

export async function addDrinkEntry(input: Omit<DrinkEntry, "id">): Promise<DrinkEntry> {
  const { data, error } = await supabase
    .from("drink_entries")
    .insert(toDrinkEntryInsert(input))
    .select()
    .single();
  if (error) throw error;
  return mapDrinkEntry(data);
}

export async function updateDrinkEntry(entry: DrinkEntry): Promise<DrinkEntry> {
  const userId = await requireUserId();
  const { id, ...rest } = entry;
  const { data, error } = await supabase
    .from("drink_entries")
    .update(toDrinkEntryInsert(rest))
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return mapDrinkEntry(data);
}

export async function deleteDrinkEntry(id: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from("drink_entries").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}
