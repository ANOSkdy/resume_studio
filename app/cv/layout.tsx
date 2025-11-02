import type { ReactNode } from "react";

export default function CVLayout({ children }: { children: ReactNode }) {
  return (
    <main className="theme-resume resume-shell">
      <div className="resume-shell-inner">{children}</div>
    </main>
  );
}
