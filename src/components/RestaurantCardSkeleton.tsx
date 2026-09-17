export default function RestaurantCardSkeleton() {
  return (
    <div className="nu-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-2/3 space-y-2">
          <div className="nu-shimmer h-4 rounded" />
          <div className="nu-shimmer h-3 w-4/5 rounded" />
        </div>
        <div className="nu-shimmer h-4 w-16 rounded" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="nu-shimmer h-5 w-16 rounded-full" />
        <div className="nu-shimmer h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
