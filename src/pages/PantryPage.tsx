import PageContainer from "../components/PageContainer";
import EmptyState from "../components/EmptyState";
import { PackageIcon } from "../components/icons";

/**
 * Placeholder for the future "what do I have at home" feature — will let
 * the user mark which ingredients/spirits they own (against the shared
 * catalog in src/data/catalog.ts) so drinks can be checked against what's
 * actually on hand. Not built yet; this just reserves the tab, same as the
 * disabled "Scan menu" button reserves its spot on the drink form.
 */
export default function PantryPage() {
  return (
    <PageContainer>
      <header className="nu-header">
        <h1 className="font-display text-xl" style={{ color: "var(--ink)" }}>
          Pantry
        </h1>
        <p className="nu-subtitle text-xs">What you have on hand at home</p>
      </header>

      <main className="px-4 py-4 pb-32">
        <EmptyState
          icon={<PackageIcon className="h-6 w-6" />}
          title="Coming soon"
          description="Track which NA spirits and mixers you have at home, and we'll tell you what you can make."
        />
      </main>
    </PageContainer>
  );
}
