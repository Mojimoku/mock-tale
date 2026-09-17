import { Link } from "react-router-dom";
import type { DrinkEntry } from "../types";
import RatingStars from "./RatingStars";
import CategoryBadge from "./CategoryBadge";
import FlavorTagBadgeList from "./FlavorTagBadgeList";
import NAProductBadgeList from "./NAProductBadgeList";
import IngredientBadgeList from "./IngredientBadgeList";
import { EditIcon } from "./icons";

export default function DrinkCard({
  entry,
  restaurantName,
  readOnly = false,
  ingredientCatalogIds,
  spiritCatalogIds,
}: {
  entry: DrinkEntry;
  /** Shown under the drink name — for contexts (like the flat Drinks list)
   * where the restaurant isn't already established by the page around it. */
  restaurantName?: string;
  /** True for another account's shared drink — no edit link, since you
   * don't own it (the edit route wouldn't load it for you anyway). */
  readOnly?: boolean;
  /** normalized ingredient name -> catalog id, so ingredient chips can link
   * to their detail page. Omit to render them unlinked. */
  ingredientCatalogIds?: Map<string, string>;
  /** normalized "brand product" -> catalog id, same idea for NA products. */
  spiritCatalogIds?: Map<string, string>;
}) {
  // Not a single wrapping <Link> — ingredient/product chips are their own
  // links, and nested <a> elements are invalid HTML. The name and the
  // "Edit entry" row are the tap targets into the edit form instead.
  return (
    <div className="nu-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {readOnly ? (
              <h3 className="font-display text-base" style={{ color: "var(--ink)" }}>
                {entry.name}
              </h3>
            ) : (
              <Link to={`/drinks/${entry.id}/edit`} className="font-display text-base hover:underline" style={{ color: "var(--ink)" }}>
                {entry.name}
              </Link>
            )}
            {entry.isOffMenu && <span className="nu-chip-accent">Off-menu</span>}
          </div>
          {restaurantName && (
            <p className="truncate text-xs" style={{ color: "var(--ink-faint)" }}>
              {restaurantName}
            </p>
          )}
          <div className="mt-1.5">
            <CategoryBadge category={entry.category} />
          </div>
        </div>
        <RatingStars rating={entry.rating} size="sm" className="shrink-0" />
      </div>

      {entry.tastingNotes && (
        <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
          {entry.tastingNotes}
        </p>
      )}

      <FlavorTagBadgeList tags={entry.flavorTags} className="mt-3" />

      <NAProductBadgeList products={entry.naProducts} catalogIdByName={spiritCatalogIds} className="mt-3" />

      <IngredientBadgeList ingredients={entry.ingredients} catalogIdByName={ingredientCatalogIds} className="mt-3" />

      {entry.notes && (
        <p
          className="mt-3 rounded-lg px-2.5 py-1.5 text-xs italic"
          style={{ background: "var(--base-mid)", color: "var(--ink-soft)" }}
        >
          {entry.notes}
        </p>
      )}

      {!readOnly && (
        <Link
          to={`/drinks/${entry.id}/edit`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: "var(--ink-faint)" }}
        >
          <EditIcon className="h-3 w-3" />
          Edit entry
        </Link>
      )}
    </div>
  );
}
