import { StarIcon } from "./icons";

const SIZE_CLASSES = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

/** Read-only 5-star display supporting half-star ratings, filled in coral. */
export default function RatingStars({
  rating,
  size = "md",
  showNumber = true,
  className = "",
}: {
  rating: number;
  size?: keyof typeof SIZE_CLASSES;
  showNumber?: boolean;
  className?: string;
}) {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const fillPercent = Math.round(Math.min(Math.max(rating - index, 0), 1) * 100);
          return (
            <div key={index} className={`relative ${sizeClass}`}>
              <div
                className="absolute inset-0 h-full overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <StarIcon filled className="h-full w-full" />
              </div>
              <StarIcon className={`nu-star-empty absolute inset-0 h-full w-full`} />
            </div>
          );
        })}
      </div>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {showNumber && <span className="nu-rating-number">{rating.toFixed(1)}</span>}
    </div>
  );
}
