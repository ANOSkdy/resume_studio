"use client";
import { createContext, useContext, useId, useMemo, useRef, useState, KeyboardEvent } from "react";

type TabsContextType = {
  active: string;
  setActive: (v: string) => void;
  ids: string[];
  register: (id: string) => void;
};
const TabsCtx = createContext<TabsContextType | null>(null);
function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs/>");
  return ctx;
}

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  const idsRef = useRef<string[]>([]);
  const ctx = useMemo(() => ({
    active, setActive,
    get ids() { return idsRef.current; },
    register(id: string) { if (!idsRef.current.includes(id)) idsRef.current.push(id); }
  }) as TabsContextType, [active]);

  return <TabsCtx.Provider value={ctx}><div className="tabs">{children}</div></TabsCtx.Provider>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  const { ids, active, setActive } = useTabs();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const curr = ids.indexOf(active);
    if (curr < 0) return;
    let next = curr;
    if (e.key === "ArrowRight") next = (curr + 1) % ids.length;
    else if (e.key === "ArrowLeft") next = (curr - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next !== curr) { setActive(ids[next]); e.preventDefault(); }
  };
  return <div role="tablist" aria-orientation="horizontal" className="tablist" onKeyDown={onKeyDown}>{children}</div>;
}

export function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive, register } = useTabs();
  const id = `tab-${value}`;
  const selected = active === value;
  register(value);
  return (
    <button
      role="tab"
      id={id}
      aria-selected={selected}
      aria-controls={`panel-${value}`}
      tabIndex={selected ? 0 : -1}
      className="tab"
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useTabs();
  return (
    <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} hidden={active !== value} className="tabpanel">
      {children}
    </div>
  );
}
