import * as React from 'react';

function createIcon(children) {
  const Icon = React.forwardRef(function IconComponent(props, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props['aria-hidden'] ?? true}
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    );
  });
  return Icon;
}

export const User = createIcon([
  <path key="body" d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />, 
  <circle key="head" cx={12} cy={7} r={4} />,
]);

export const ArrowRight = createIcon([
  <line key="line" x1={5} y1={12} x2={19} y2={12} />, 
  <polyline key="arrow" points="12 5 19 12 12 19" />,
]);

export const ArrowDown = createIcon([
  <line key="line" x1={12} y1={5} x2={12} y2={19} />, 
  <polyline key="arrow" points="5 12 12 19 19 12" />,
]);

export const CheckCircle2 = createIcon([
  <path key="circle" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />, 
  <polyline key="check" points="22 4 12 14.01 9 11" />,
]);

export default {
  User,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
};
