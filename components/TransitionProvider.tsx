'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = { children: React.ReactNode };
const DURATION = 0.28;

export default function TransitionProvider({ children }: Props) {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const handler = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    media.addEventListener?.('change', handler);
    return () => media.removeEventListener?.('change', handler);
  }, []);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: DURATION, ease: [0.22, 1, 0.36, 1] }}
        className="fade-in"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
