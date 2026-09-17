import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      {icon && (
        <div className="nu-empty-icon flex h-16 w-16 items-center justify-center">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-display text-base" style={{ color: "var(--ink)" }}>
          {title}
        </p>
        {description && (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
