export default function DrinkCardSkeleton() {
  return (
    <div className="nu-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-1/2 space-y-2">
          <div className="nu-shimmer h-4 rounded" />
          <div className="nu-shimmer h-4 w-20 rounded-full" />
        </div>
        <div className="nu-shimmer h-4 w-16 rounded" />
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="nu-shimmer h-3 rounded" />
        <div className="nu-shimmer h-3 w-4/5 rounded" />
      </div>
    </div>
  );
}
