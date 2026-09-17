import { Link } from "react-router-dom";
import { normalizeCatalogName } from "../lib/normalizeCatalogName";

export default function IngredientBadgeList({
  ingredients,
  catalogIdByName,
  className = "",
}: {
  ingredients: string[];
  /** normalized ingredient name -> catalog_ingredients.id, for linking to its detail page. */
  catalogIdByName?: Map<string, string>;
  className?: string;
}) {
  if (ingredients.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {ingredients.map((ingredient, index) => {
        const catalogId = catalogIdByName?.get(normalizeCatalogName(ingredient));
        const key = `${ingredient}-${index}`;
        if (catalogId) {
          return (
            <Link key={key} to={`/ingredients/${catalogId}`} className="nu-tag">
              {ingredient}
            </Link>
          );
        }
        return (
          <span key={key} className="nu-tag">
            {ingredient}
          </span>
        );
      })}
    </div>
  );
}
