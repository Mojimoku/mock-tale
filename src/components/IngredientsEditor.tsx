import { useState } from "react";
import { PlusIcon, XIcon } from "./icons";
import { resolveIngredient } from "../data/catalog";

export default function IngredientsEditor({
  ingredients,
  onChange,
}: {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addIngredient() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (ingredients.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...ingredients, trimmed]);
    setDraft("");
    // Best-effort: fold this into the shared ingredient catalog in the
    // background. Never blocks the form or surfaces an error to the user —
    // it's enrichment, not core functionality.
    resolveIngredient(trimmed).catch((error) => {
      console.warn("Couldn't resolve ingredient against the catalog", error);
    });
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  return (
    <div>
      {ingredients.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {ingredients.map((ingredient, index) => (
            <li
              key={`${ingredient}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm"
              style={{ background: "var(--base-mid)", color: "var(--ink)" }}
            >
              <span>{ingredient}</span>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                aria-label={`Remove ${ingredient}`}
                className="rounded-full p-0.5"
                style={{ color: "var(--ink-faint)" }}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addIngredient();
            }
          }}
          placeholder="Add an ingredient"
          className="nu-input min-w-0 flex-1 text-sm"
        />
        <button
          type="button"
          onClick={addIngredient}
          disabled={!draft.trim()}
          className="nu-btn nu-btn-ghost shrink-0 px-3"
          aria-label="Add ingredient"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
