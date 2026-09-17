import { Link } from "react-router-dom";
import type { Restaurant } from "../types";
import type { RestaurantStats } from "../lib/restaurantStats";
import RatingStars from "./RatingStars";
import CategoryBadge from "./CategoryBadge";

export default function RestaurantCard({
  restaurant,
  stats,
}: {
  restaurant: Restaurant;
  stats: RestaurantStats;
}) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="nu-card block p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base" style={{ color: "var(--ink)" }}>
            {restaurant.name}
          </h3>
          <p className="truncate text-sm" style={{ color: "var(--ink-soft)" }}>
            {restaurant.neighborhood}
            {restaurant.cuisineType ? ` · ${restaurant.cuisineType}` : ""}
          </p>
        </div>
        {stats.bestRating !== null && (
          <RatingStars rating={stats.bestRating} size="sm" className="shrink-0" />
        )}
      </div>

      {stats.drinkCount > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {stats.categories.map((category) => (
            <CategoryBadge key={category} category={category} short />
          ))}
          <span className="text-xs" style={{ color: "var(--ink-faint)" }}>
            · {stats.drinkCount} drink{stats.drinkCount === 1 ? "" : "s"} logged
          </span>
        </div>
      ) : (
        <p className="mt-3 text-xs italic" style={{ color: "var(--ink-faint)" }}>
          No drinks logged yet
        </p>
      )}
    </Link>
  );
}
