import RatingStars from "./RatingStars";

/**
 * A slider is far more reliable than tappable half-star hit targets on a
 * phone, so editing uses a coral-knobbed range slider (1-5, half-steps)
 * with a live star preview above it.
 */
export default function RatingInput({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}) {
  return (
    <div>
      <div className="mb-2">
        <RatingStars rating={value} size="lg" />
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={0.5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="nu-slider"
      />
      <div className="mt-1 flex justify-between text-xs font-semibold" style={{ color: "var(--ink-faint)" }}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}
