import { Link } from "react-router-dom";
import type { NAProduct } from "../types";
import { TagIcon } from "./icons";
import { normalizeCatalogName } from "../lib/normalizeCatalogName";

export default function NAProductBadgeList({
  products,
  catalogIdByName,
  className = "",
}: {
  products: NAProduct[];
  /** normalized "brand product" -> catalog_spirits.id, for linking to its detail page. */
  catalogIdByName?: Map<string, string>;
  className?: string;
}) {
  if (products.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {products.map((product, index) => {
        const catalogId = catalogIdByName?.get(normalizeCatalogName(`${product.brand} ${product.product}`));
        const content = (
          <>
            <TagIcon className="h-3 w-3" style={{ color: "var(--ink-faint)" }} />
            <span className="font-semibold">{product.brand}</span>
            <span style={{ color: "var(--ink-faint)" }}>·</span>
            {product.product}
          </>
        );
        const key = `${product.brand}-${product.product}-${index}`;
        if (catalogId) {
          return (
            <Link key={key} to={`/spirits/${catalogId}`} className="nu-tag">
              {content}
            </Link>
          );
        }
        return (
          <span key={key} className="nu-tag">
            {content}
          </span>
        );
      })}
    </div>
  );
}
