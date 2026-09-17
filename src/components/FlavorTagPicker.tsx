import { FLAVOR_TAGS } from "../lib/flavorTags";

export default function FlavorTagPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Flavor tags">
      {FLAVOR_TAGS.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(tag)}
            className="nu-chip nu-chip-btn"
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
