import type { ReactNode } from "react";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  pattern?: "dots" | "waves" | "none";
  className?: string;
  children: ReactNode;
}

export default function Section({ title, subtitle, pattern = "none", className, children }: SectionProps) {
  return (
    <section className={cn("section-card", className)}>
      {pattern !== "none" && (
        <div
          aria-hidden
          className={cn(
            "section-pattern",
            pattern === "dots" && "pattern-dots text-primary",
            pattern === "waves" && "pattern-waves text-accent1"
          )}
        />
      )}
      <div className="section-inner">
        {(title || subtitle) && (
          <header>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
