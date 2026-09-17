import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CatalogIngredient, DrinkWithRestaurant } from "../types";
import { getCatalogIngredient, getCatalogLookupMaps, getMyDrinksForIngredient, getSharedDrinksForIngredient } from "../data/catalog";
import { INGREDIENT_CATEGORY_LABELS } from "../lib/catalogCategories";
import PageContainer from "../components/PageContainer";
import DrinkCard from "../components/DrinkCard";
import DrinkCardSkeleton from "../components/DrinkCardSkeleton";
import EmptyState from "../components/EmptyState";
import { ChevronLeftIcon } from "../components/icons";

export default function IngredientDetailPage() {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [ingredient, setIngredient] = useState<CatalogIngredient | null>(null);
  const [myDrinks, setMyDrinks] = useState<DrinkWithRestaurant[]>([]);
  const [sharedDrinks, setSharedDrinks] = useState<DrinkWithRestaurant[]>([]);
  const [catalogLookup, setCatalogLookup] = useState<{
    ingredientIdsByName: Map<string, string>;
    spiritIdsByName: Map<string, string>;
  }>({ ingredientIdsByName: new Map(), spiritIdsByName: new Map() });

  useEffect(() => {
    if (!ingredientId) return;
    let cancelled = false;
    setStatus("loading");
    Promise.all([
      getCatalogIngredient(ingredientId),
      getMyDrinksForIngredient(ingredientId),
      getSharedDrinksForIngredient(ingredientId),
      getCatalogLookupMaps(),
    ])
      .then(([found, mine, shared, lookup]) => {
        if (cancelled) return;
        if (!found) {
          setStatus("not-found");
          return;
        }
        setIngredient(found);
        setMyDrinks(mine);
        setSharedDrinks(shared);
        setCatalogLookup(lookup);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ingredientId]);

  return (
    <PageContainer>
      <header className="nu-header-plain">
        <Link
          to="/drinks"
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold"
          style={{ color: "var(--coral-dark)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Drinks
        </Link>

        {status === "ready" && ingredient && (
          <>
            <h1 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
              {ingredient.name}
            </h1>
            <p className="nu-subtitle text-xs">{INGREDIENT_CATEGORY_LABELS[ingredient.category]}</p>
          </>
        )}

        {status === "loading" && (
          <div className="space-y-2">
            <div className="nu-shimmer h-5 w-2/3 rounded" />
            <div className="nu-shimmer h-3 w-1/3 rounded" />
          </div>
        )}
      </header>

      <main className="space-y-5 px-4 py-4 pb-32">
        {status === "loading" && (
          <>
            <DrinkCardSkeleton />
            <DrinkCardSkeleton />
          </>
        )}

        {status === "not-found" && (
          <EmptyState title="Ingredient not found" description="It may have been removed." />
        )}

        {status === "error" && (
          <EmptyState title="Couldn't load this ingredient" description="Try reloading the page." />
        )}

        {status === "ready" && (
          <>
            <section>
              <h2 className="nu-filter-label mb-2">Your drinks</h2>
              {myDrinks.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
                  None of your logged drinks use this yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {myDrinks.map(({ entry, restaurant }) => (
                    <DrinkCard
                      key={entry.id}
                      entry={entry}
                      restaurantName={restaurant.name}
                      ingredientCatalogIds={catalogLookup.ingredientIdsByName}
                      spiritCatalogIds={catalogLookup.spiritIdsByName}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="nu-filter-label mb-2">From other tasters</h2>
              {sharedDrinks.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
                  No one's shared a drink with this yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {sharedDrinks.map(({ entry, restaurant }) => (
                    <DrinkCard
                      key={entry.id}
                      entry={entry}
                      restaurantName={restaurant.name}
                      readOnly
                      ingredientCatalogIds={catalogLookup.ingredientIdsByName}
                      spiritCatalogIds={catalogLookup.spiritIdsByName}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </PageContainer>
  );
}
