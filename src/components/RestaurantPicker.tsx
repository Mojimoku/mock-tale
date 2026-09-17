import { useState } from "react";
import type { Restaurant } from "../types";
import { PlusIcon } from "./icons";

export default function RestaurantPicker({
  restaurants,
  value,
  onChange,
  onAddRestaurant,
}: {
  restaurants: Restaurant[];
  value: string;
  onChange: (restaurantId: string) => void;
  onAddRestaurant: (input: Omit<Restaurant, "id">) => Promise<Restaurant>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ name: "", neighborhood: "", city: "", cuisineType: "" });

  const sorted = [...restaurants].sort((a, b) => a.name.localeCompare(b.name));

  async function handleAdd() {
    if (!draft.name.trim() || !draft.neighborhood.trim() || !draft.city.trim()) return;
    setSaving(true);
    try {
      const restaurant = await onAddRestaurant({
        name: draft.name.trim(),
        neighborhood: draft.neighborhood.trim(),
        city: draft.city.trim(),
        cuisineType: draft.cuisineType.trim() || undefined,
      });
      onChange(restaurant.id);
      setDraft({ name: "", neighborhood: "", city: "", cuisineType: "" });
      setIsAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="nu-input text-sm">
        <option value="" disabled>
          Select a restaurant…
        </option>
        {sorted.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name} — {restaurant.neighborhood}
          </option>
        ))}
      </select>

      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-bold"
          style={{ color: "var(--coral-dark)" }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add a new restaurant
        </button>
      ) : (
        <div className="nu-card-dashed mt-3 space-y-2 p-3">
          <input
            type="text"
            placeholder="Restaurant name"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            className="nu-input text-sm"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Neighborhood"
              value={draft.neighborhood}
              onChange={(event) => setDraft({ ...draft, neighborhood: event.target.value })}
              className="nu-input min-w-0 flex-1 text-sm"
            />
            <input
              type="text"
              placeholder="City"
              value={draft.city}
              onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              className="nu-input min-w-0 flex-1 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Cuisine type (optional)"
            value={draft.cuisineType}
            onChange={(event) => setDraft({ ...draft, cuisineType: event.target.value })}
            className="nu-input text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !draft.name.trim() || !draft.neighborhood.trim() || !draft.city.trim()}
              className="nu-btn nu-btn-primary px-3 py-1.5 text-sm"
            >
              {saving ? "Adding…" : "Add restaurant"}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-sm font-medium"
              style={{ color: "var(--ink-soft)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
