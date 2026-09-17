# mock/tale (∅)

Track which restaurants have good non-alcoholic drink options, and which specific drinks were
actually worth ordering.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Supabase (Postgres + auto-generated REST API via `@supabase/supabase-js`, plus email/password auth)

All reads/writes go through [`src/data/dataProvider.ts`](src/data/dataProvider.ts) — components
never call Supabase directly. That file maps between the app's domain types
([`src/types.ts`](src/types.ts)) and the `restaurants` / `drink_entries` tables, so if the backend
ever changes again, this is the only file that needs to.

Every restaurant and drink entry belongs to the account that created it (`user_id`, enforced by
row-level-security policies scoped to `auth.uid()`) — see [`src/auth/`](src/auth) for the
sign-in/sign-up flow and [`src/auth/ProtectedRoute.tsx`](src/auth/ProtectedRoute.tsx) for the route
guard.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + publishable key
npm run dev
```

Then open the printed local URL. The layout is mobile-first — narrow your browser window (or open
dev tools' device toolbar) to see it as intended.

### Backend

The schema lives in the "SipLog" Supabase project (`jblmlfkffvbudkfceieg` — the project's own name
predates the mock/tale rebrand and hasn't been renamed) — `restaurants` and `drink_entries`
(each with a `user_id` column scoping rows to their owner), plus `catalog_ingredients` and
`catalog_spirits` (global, not user-scoped — see below). Schema and RLS policies were created via
migrations applied through the Supabase MCP server. `src/data/database.types.ts` is generated from
that schema — regenerate it after any migration rather than hand-editing it.

### Ingredient/spirit catalog

`catalog_ingredients` and `catalog_spirits` are a shared, global reference layer, separate from the
freeform `ingredients`/`na_products` text a drink entry stores. [`src/data/catalog.ts`](src/data/catalog.ts)
exposes `resolveIngredient`/`resolveSpirit`: given a name (typed by hand today; scanned from a menu
photo, eventually), they match it to an existing catalog entry — tolerant of typos/OCR noise/plurals
via Postgres `levenshtein()`, scaled by string length — or create a new one, guessing its category
from keyword heuristics in [`src/lib/categorize.ts`](src/lib/categorize.ts) (an existing match always
keeps its current category; the guess only applies to a brand-new row). Wired into the drink form's
ingredient/NA-product fields today as a non-blocking background call — adding an item enriches the
catalog silently, whether or not it resolves to something new.

This is what will eventually let drinks be searched/filtered by ingredient/spirit category, and let a
future "what's in my pantry" feature check a drink's needs against what the user has on hand — neither
of those is built yet.

## Design system

Visual identity is neumorphic: matte extruded/pressed surfaces on a neutral base
(`src/index.css`, the `nu-*` classes), with coral reserved for brand/primary actions and a pastel
per drink category. The ∅ mark (`src/components/BrandMark.tsx`) and "m∅ck/tale" wordmark
(`src/components/Wordmark.tsx`) are the two places the brand mark appears.

## Project structure

```
src/
  types.ts                 Restaurant / DrinkEntry domain model (what the UI works with)
  data/
    supabaseClient.ts       Supabase client, built from VITE_SUPABASE_* env vars
    database.types.ts       Generated DB types (regenerate after schema changes)
    dataProvider.ts          The only module that reads/writes restaurant/drink data
    catalog.ts               The only module that reads/writes the ingredient/spirit catalog
    mockData.ts              Historical reference / original seed data, no longer imported
  auth/                     Supabase auth context, sign-in/up, protected route guard
  lib/                      Category metadata, flavor tag list, filtering/sorting helpers,
                            catalog category labels + categorization heuristics
  components/               Reusable UI (cards, badges, pickers, rating input, brand mark, etc.)
  pages/
    LoginPage.tsx            Sign in / create account
    MyListPage.tsx           Home — restaurant list, search & filter
    RestaurantDetailPage.tsx
    DrinkFormPage.tsx         Add/edit a drink entry
```

## Scope notes

- The "Scan menu" button on the drink form is a visible placeholder for a future menu-photo-scan
  feature — it's disabled and does nothing yet.
- No social/crowdsourced features.
