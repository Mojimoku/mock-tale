import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Rating pip — a coral-fillable riff on the ∅ brand mark, used in place of a
 * star. `filled` renders just the solid interior disc (meant to sit behind
 * a width-clipped overlay for partial fill); the unfilled ring+slash frame
 * is drawn on top and unclipped so it's never cut off mid-fill.
 */
export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      // preserveAspectRatio="...slice" is required here: this icon gets
      // rendered inside a width-clipped container for partial fill, and
      // without "slice" the square viewBox would shrink-to-fit that
      // narrower box (letterboxed) instead of staying full-size and being
      // cropped at the clip edge — collapsing a half-fill into a tiny dot.
      <svg viewBox="0 0 14 14" preserveAspectRatio="xMinYMid slice" fill="var(--coral)" {...props}>
        <circle cx="7" cy="7" r="4.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="0.875" {...props}>
      <circle cx="7" cy="7" r="4.5" />
      <line x1="11.8094" y1="1.80936" x2="1.80936" y2="11.8094" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M20 18h.01" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8a2 2 0 0 1 2-2h1.5l1-1.5h9l1 1.5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.59 13.41L11 22l-9-9L11 2h9v9z" />
      <circle cx="15.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CupIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 3h13l-1.2 13.5A3 3 0 0 1 12.82 19H8.18a3 3 0 0 1-2.98-2.5L4 3z" />
      <path d="M17 6h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 21h7" />
    </svg>
  );
}

export function GlassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12l-1.5 15a3 3 0 0 1-3 2.7h-3a3 3 0 0 1-3-2.7L6 3z" />
      <path d="M6.7 8h10.6" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <circle cx="12" cy="15.25" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v9l9 5 9-5V8" />
      <path d="M12 13v9" />
    </svg>
  );
}
