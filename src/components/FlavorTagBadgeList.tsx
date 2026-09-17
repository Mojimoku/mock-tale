export default function FlavorTagBadgeList({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span key={tag} className="nu-chip">
          {tag}
        </span>
      ))}
    </div>
  );
}
