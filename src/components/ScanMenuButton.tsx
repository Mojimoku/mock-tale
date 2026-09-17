import { CameraIcon } from "./icons";

/**
 * Placeholder for the future "scan a menu photo and prefill this form"
 * feature. Intentionally disabled — this build has no OCR/scanning, this
 * just documents where that feature will plug in later.
 */
export default function ScanMenuButton() {
  return (
    <div>
      <button
        type="button"
        disabled
        title="Coming soon — will scan a menu photo and prefill this form"
        className="nu-btn flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm"
        style={{
          background: "var(--base)",
          color: "var(--ink-faint)",
          boxShadow: "var(--shadow-pressed-sm)",
        }}
      >
        <CameraIcon className="h-4 w-4" />
        Scan menu
      </button>
      <p className="mt-1 text-center text-xs" style={{ color: "var(--ink-faint)" }}>
        Coming soon — will scan a menu photo and prefill this form
      </p>
    </div>
  );
}
