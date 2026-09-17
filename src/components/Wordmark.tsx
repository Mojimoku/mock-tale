/**
 * The "m∅ck/tale" wordmark — the ∅ mark integrated as the "o" in "mock",
 * rendered in coral so the logo carries its one accent color even in plain
 * text contexts.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`nu-wordmark ${className}`}>
      m<span className="nu-wordmark-mark">∅</span>ck/tale
    </span>
  );
}
