import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { DrinkEntry, Restaurant } from "../types";
import { getDrinkEntries, getRestaurant } from "../data/dataProvider";
import { getCatalogLookupMaps } from "../data/catalog";
import { computeRestaurantStats } from "../lib/restaurantStats";
import PageContainer from "../components/PageContainer";
import RatingStars from "../components/RatingStars";
import CategoryBadge from "../components/CategoryBadge";
import DrinkCard from "../components/DrinkCard";
import DrinkCardSkeleton from "../components/DrinkCardSkeleton";
import EmptyState from "../components/EmptyState";
import { ChevronLeftIcon, CupIcon, PlusIcon } from "../components/icons";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [catalogLookup, setCatalogLookup] = useState<{
    ingredientIdsByName: Map<string, string>;
    spiritIdsByName: Map<string, string>;
  }>({ ingredientIdsByName: new Map(), spiritIdsByName: new Map() });

  useEffect(() => {
    if (!restaurantId) return;
    let cancelled = false;
    setStatus("loading");
    Promise.all([getRestaurant(restaurantId), getDrinkEntries(restaurantId), getCatalogLookupMaps()])
      .then(([foundRestaurant, foundEntries, lookup]) => {
        if (cancelled) return;
        if (!foundRestaurant) {
          setStatus("not-found");
          return;
        }
        setRestaurant(foundRestaurant);
        setEntries([...foundEntries].sort((a, b) => b.rating - a.rating));
        setCatalogLookup(lookup);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const stats = computeRestaurantStats(entries);

  return (
    <PageContainer>
      <header className="nu-header-plain">
        <Link
          to="/"
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold"
          style={{ color: "var(--coral-dark)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          My List
        </Link>

        {status === "ready" && restaurant && (
          <>
            <h1 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
              {restaurant.name}
            </h1>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {restaurant.neighborhood}, {restaurant.city}
              {restaurant.cuisineType ? ` · ${restaurant.cuisineType}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {stats.bestRating !== null && <RatingStars rating={stats.bestRating} size="sm" />}
              {stats.categories.map((category) => (
                <CategoryBadge key={category} category={category} short />
              ))}
            </div>
          </>
        )}

        {status === "loading" && (
          <div className="space-y-2">
            <div className="nu-shimmer h-5 w-2/3 rounded" />
            <div className="nu-shimmer h-3 w-1/2 rounded" />
          </div>
        )}
      </header>

      <main className="space-y-3 px-4 py-4 pb-32">
        {status === "loading" && (
          <>
            <DrinkCardSkeleton />
            <DrinkCardSkeleton />
          </>
        )}

        {status === "not-found" && (
          <EmptyState title="Restaurant not found" description="It may have been removed." />
        )}

        {status === "error" && (
          <EmptyState title="Couldn't load this restaurant" description="Try reloading the page." />
        )}

        {status === "ready" && entries.length === 0 && (
          <EmptyState
            icon={<CupIcon className="h-6 w-6" />}
            title="No drinks logged here yet"
            description="Be the first to log what's worth ordering."
            action={
              <Link
                to={`/drinks/new?restaurantId=${restaurantId}`}
                className="nu-btn nu-btn-primary px-4 py-2 text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                Log a drink
              </Link>
            }
          />
        )}

        {status === "ready" &&
          entries.length > 0 &&
          entries.map((entry) => (
            <DrinkCard
              key={entry.id}
              entry={entry}
              ingredientCatalogIds={catalogLookup.ingredientIdsByName}
              spiritCatalogIds={catalogLookup.spiritIdsByName}
            />
          ))}

        {status === "ready" && entries.length > 0 && (
          <Link
            to={`/drinks/new?restaurantId=${restaurantId}`}
            className="nu-card-dashed flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold"
          >
            <PlusIcon className="h-4 w-4" />
            Log another drink here
          </Link>
        )}
      </main>
    </PageContainer>
  );
}
