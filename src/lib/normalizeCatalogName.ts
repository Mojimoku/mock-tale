/**
 * Mirrors the normalization the `resolve_catalog_*` Postgres functions use
 * (lowercase, trim, collapse whitespace) — lets client code build a
 * name -> catalog-id lookup that matches how the catalog itself is keyed.
 *
 * Known limitation: this is an *exact* match on the normalized text, not
 * the edit-distance-tolerant fuzzy match the resolver does server-side. A
 * drink whose stored ingredient text was a typo that got fuzzy-matched to
 * a different canonical catalog name (e.g. "Grapefruitt" -> "Grapefruit")
 * won't resolve to a link through this helper, even though the actual
 * `drink_ingredient_links`/`drink_spirit_links` row is correct. This only
 * affects whether a chip renders as clickable — display text and the
 * underlying catalog data are unaffected either way.
 */
export function normalizeCatalogName(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}
