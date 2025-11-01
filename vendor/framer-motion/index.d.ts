import * as React from 'react';

type MotionProps = React.HTMLAttributes<HTMLElement> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  layout?: unknown;
};

type MotionComponent<P> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<any>>;

declare const motion: Record<string, MotionComponent<MotionProps>>;

export const AnimatePresence: React.FC<{ children?: React.ReactNode; mode?: 'wait' | 'sync' | 'popLayout' }>;
export { motion };

declare const _default: {
  AnimatePresence: typeof AnimatePresence;
  motion: typeof motion;
};
export default _default;
