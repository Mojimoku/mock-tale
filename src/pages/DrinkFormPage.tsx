import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { DrinkCategory, DrinkEntry, NAProduct, Restaurant } from "../types";
import {
  addDrinkEntry,
  addRestaurant,
  deleteDrinkEntry,
  getDrinkEntry,
  getRestaurants,
  updateDrinkEntry,
} from "../data/dataProvider";
import PageContainer from "../components/PageContainer";
import RestaurantPicker from "../components/RestaurantPicker";
import CategoryPicker from "../components/CategoryPicker";
import RatingInput from "../components/RatingInput";
import FlavorTagPicker from "../components/FlavorTagPicker";
import IngredientsEditor from "../components/IngredientsEditor";
import NAProductsEditor from "../components/NAProductsEditor";
import ScanMenuButton from "../components/ScanMenuButton";
import EmptyState from "../components/EmptyState";
import { ChevronLeftIcon, TrashIcon } from "../components/icons";
import { syncDrinkIngredientLinks, syncDrinkSpiritLinks } from "../data/catalog";

interface FormState {
  restaurantId: string;
  name: string;
  category: DrinkCategory;
  rating: number;
  flavorTags: string[];
  tastingNotes: string;
  ingredients: string[];
  naProducts: NAProduct[];
  isOffMenu: boolean;
  isShared: boolean;
  notes: string;
}

function emptyForm(restaurantId = ""): FormState {
  return {
    restaurantId,
    name: "",
    category: "basic",
    rating: 3,
    flavorTags: [],
    tastingNotes: "",
    ingredients: [],
    naProducts: [],
    isOffMenu: false,
    isShared: false,
    notes: "",
  };
}

export default function DrinkFormPage() {
  const { drinkId } = useParams<{ drinkId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(drinkId);

  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm(searchParams.get("restaurantId") ?? ""));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const restaurantsPromise = getRestaurants();
    const entryPromise = isEditing && drinkId ? getDrinkEntry(drinkId) : Promise.resolve(undefined);

    Promise.all([restaurantsPromise, entryPromise])
      .then(([restaurantList, entry]) => {
        if (cancelled) return;
        setRestaurants(restaurantList);

        if (isEditing) {
          if (!entry) {
            setStatus("not-found");
            return;
          }
          setForm({
            restaurantId: entry.restaurantId,
            name: entry.name,
            category: entry.category,
            rating: entry.rating,
            flavorTags: entry.flavorTags,
            tastingNotes: entry.tastingNotes,
            ingredients: entry.ingredients,
            naProducts: entry.naProducts,
            isOffMenu: Boolean(entry.isOffMenu),
            isShared: entry.isShared,
            notes: entry.notes ?? "",
          });
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drinkId, isEditing]);

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.restaurantId) nextErrors.restaurantId = "Choose a restaurant";
    if (!form.name.trim()) nextErrors.name = "Give the drink a name";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Omit<DrinkEntry, "id"> = {
        restaurantId: form.restaurantId,
        name: form.name.trim(),
        category: form.category,
        rating: form.rating,
        flavorTags: form.flavorTags,
        tastingNotes: form.tastingNotes.trim(),
        ingredients: form.ingredients,
        naProducts: form.naProducts,
        isOffMenu: form.isOffMenu || undefined,
        isShared: form.isShared,
        notes: form.notes.trim() || undefined,
      };

      const saved =
        isEditing && drinkId
          ? await updateDrinkEntry({ ...payload, id: drinkId })
          : await addDrinkEntry(payload);

      // Best-effort: keep the catalog's "which drinks use this" links in
      // sync with what was just saved. Never blocks navigation — a drink
      // that saved fine but didn't fully re-link is a minor enrichment
      // gap, not a reason to make the user think their save failed.
      try {
        await Promise.all([
          syncDrinkIngredientLinks(saved.id, saved.ingredients),
          syncDrinkSpiritLinks(saved.id, saved.naProducts),
        ]);
      } catch (error) {
        console.warn("Couldn't sync catalog links for this drink", error);
      }

      navigate(`/restaurants/${form.restaurantId}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!drinkId) return;
    if (!window.confirm("Delete this drink entry? This can't be undone.")) return;
    setDeleting(true);
    try {
      await deleteDrinkEntry(drinkId);
      navigate(form.restaurantId ? `/restaurants/${form.restaurantId}` : "/");
    } finally {
      setDeleting(false);
    }
  }

  const backTo = form.restaurantId ? `/restaurants/${form.restaurantId}` : "/";

  return (
    <PageContainer>
      <header className="nu-header-plain">
        <Link
          to={backTo}
          className="mb-2 inline-flex items-center gap-1 text-sm font-bold"
          style={{ color: "var(--ink-soft)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Cancel
        </Link>
        <h1 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
          {isEditing ? "Edit drink" : "Log a drink"}
        </h1>
      </header>

      {status === "loading" && (
        <div className="space-y-4 px-4 py-6">
          <div className="nu-shimmer h-10 rounded-lg" />
          <div className="nu-shimmer h-10 rounded-lg" />
          <div className="nu-shimmer h-24 rounded-lg" />
        </div>
      )}

      {status === "not-found" && (
        <EmptyState title="Drink entry not found" description="It may have already been deleted." />
      )}

      {status === "error" && (
        <EmptyState title="Couldn't load the form" description="Try reloading the page." />
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-6 px-4 py-5 pb-10">
          <ScanMenuButton />

          <Field label="Restaurant" error={errors.restaurantId}>
            <RestaurantPicker
              restaurants={restaurants}
              value={form.restaurantId}
              onChange={(restaurantId) => setForm({ ...form, restaurantId })}
              onAddRestaurant={async (input) => {
                const restaurant = await addRestaurant(input);
                setRestaurants((prev) => [...prev, restaurant]);
                return restaurant;
              }}
            />
          </Field>

          <Field label="Drink name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Smoked Rosemary No. 5"
              className="nu-input text-sm"
            />
          </Field>

          <Field label="Category">
            <CategoryPicker
              value={form.category}
              onChange={(category) => setForm({ ...form, category })}
            />
          </Field>

          <Field label="Rating">
            <RatingInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          </Field>

          <Field label="Flavor tags">
            <FlavorTagPicker
              selected={form.flavorTags}
              onToggle={(tag) =>
                setForm({
                  ...form,
                  flavorTags: form.flavorTags.includes(tag)
                    ? form.flavorTags.filter((t) => t !== tag)
                    : [...form.flavorTags, tag],
                })
              }
            />
          </Field>

          <Field label="Tasting notes">
            <textarea
              value={form.tastingNotes}
              onChange={(event) => setForm({ ...form, tastingNotes: event.target.value })}
              placeholder="What did it actually taste like?"
              rows={3}
              className="nu-input"
            />
          </Field>

          <Field label="Ingredients">
            <IngredientsEditor
              ingredients={form.ingredients}
              onChange={(ingredients) => setForm({ ...form, ingredients })}
            />
          </Field>

          <Field label="NA brands &amp; products">
            <p className="mb-2 text-xs" style={{ color: "var(--ink-faint)" }}>
              The specific NA products used — the beer/wine itself, or the NA spirit(s) behind a
              mocktail or signature drink. There can be more than one.
            </p>
            <NAProductsEditor
              products={form.naProducts}
              onChange={(naProducts) => setForm({ ...form, naProducts })}
            />
          </Field>

          <label className="nu-card flex items-center justify-between px-3 py-2.5">
            <span className="text-sm font-bold" style={{ color: "var(--ink)" }}>
              Off-menu
            </span>
            <input
              type="checkbox"
              checked={form.isOffMenu}
              onChange={(event) => setForm({ ...form, isOffMenu: event.target.checked })}
              className="sr-only"
            />
            <span className="nu-toggle-track" data-on={form.isOffMenu} aria-hidden="true">
              <span className="nu-toggle-knob" />
            </span>
          </label>

          <label className="nu-card flex items-center justify-between px-3 py-2.5">
            <span>
              <span className="block text-sm font-bold" style={{ color: "var(--ink)" }}>
                Share this drink
              </span>
              <span className="block text-xs" style={{ color: "var(--ink-faint)" }}>
                Visible to other accounts from an ingredient/spirit page — never edits, never your
                other drinks.
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.isShared}
              onChange={(event) => setForm({ ...form, isShared: event.target.checked })}
              className="sr-only"
            />
            <span className="nu-toggle-track ml-3 shrink-0" data-on={form.isShared} aria-hidden="true">
              <span className="nu-toggle-knob" />
            </span>
          </label>

          <Field label="Notes (tips for next time)">
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="e.g. Ask for it light on syrup"
              rows={2}
              className="nu-input text-sm"
            />
          </Field>

          <button type="submit" disabled={submitting} className="nu-btn nu-btn-primary w-full py-3 text-sm">
            {submitting ? "Saving…" : isEditing ? "Save changes" : "Add drink"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="nu-btn nu-btn-danger w-full py-2 text-sm"
            >
              <TrashIcon className="h-4 w-4" />
              {deleting ? "Deleting…" : "Delete entry"}
            </button>
          )}
        </form>
      )}
    </PageContainer>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold" style={{ color: "var(--ink)" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs font-semibold" style={{ color: "var(--coral-dark)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
