import type { ReactNode } from "react";

/**
 * The app shell: a phone-width neumorphic surface centered on the page.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="nu-app">
      <div className="nu-page">{children}</div>
    </div>
  );
}
