"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function TransitionProvider({ children }: Props) {
  const pathname = usePathname();
  const [reduce, setReduce] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduce(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduce) return;
    setAnimate(false);
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, reduce]);

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <div data-route={pathname} className={`page-transition ${animate ? "fade-in" : ""}`}>
      {children}
    </div>
  );
}

export default TransitionProvider;
