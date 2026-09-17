import { useState } from "react";
import type { NAProduct } from "../types";
import { PlusIcon, XIcon } from "./icons";
import { resolveSpirit } from "../data/catalog";

/**
 * Add/remove list of specific branded NA products used in a drink (e.g.
 * brand "Athletic Brewing", product "Golden Dawn"). A mocktail or signature
 * drink can use more than one — e.g. an NA gin alternative *and* an NA
 * amaro alternative in the same glass — so this is a list, not a single pair.
 */
export default function NAProductsEditor({
  products,
  onChange,
}: {
  products: NAProduct[];
  onChange: (products: NAProduct[]) => void;
}) {
  const [brandDraft, setBrandDraft] = useState("");
  const [productDraft, setProductDraft] = useState("");

  function addProduct() {
    const brand = brandDraft.trim();
    const product = productDraft.trim();
    if (!brand || !product) return;
    onChange([...products, { brand, product }]);
    setBrandDraft("");
    setProductDraft("");
    // Best-effort: fold this into the shared spirit catalog in the
    // background. Never blocks the form or surfaces an error to the user —
    // it's enrichment, not core functionality.
    resolveSpirit(brand, product).catch((error) => {
      console.warn("Couldn't resolve NA product against the catalog", error);
    });
  }

  function removeProduct(index: number) {
    onChange(products.filter((_, i) => i !== index));
  }

  return (
    <div>
      {products.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {products.map((product, index) => (
            <li
              key={`${product.brand}-${product.product}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm"
              style={{ background: "var(--base-mid)", color: "var(--ink)" }}
            >
              <span>
                <span className="font-semibold">{product.brand}</span> — {product.product}
              </span>
              <button
                type="button"
                onClick={() => removeProduct(index)}
                aria-label={`Remove ${product.brand} ${product.product}`}
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
          value={brandDraft}
          onChange={(event) => setBrandDraft(event.target.value)}
          placeholder="Brand (e.g. Athletic Brewing)"
          className="nu-input min-w-0 flex-1 text-sm"
        />
        <input
          type="text"
          value={productDraft}
          onChange={(event) => setProductDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addProduct();
            }
          }}
          placeholder="Product (e.g. Golden Dawn)"
          className="nu-input min-w-0 flex-1 text-sm"
        />
        <button
          type="button"
          onClick={addProduct}
          disabled={!brandDraft.trim() || !productDraft.trim()}
          className="nu-btn nu-btn-ghost shrink-0 px-3"
          aria-label="Add product"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
