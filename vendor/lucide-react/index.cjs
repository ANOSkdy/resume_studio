const React = require('react');

function createIcon(children) {
  const Icon = React.forwardRef(function IconComponent(props, ref) {
    return React.createElement(
      'svg',
      Object.assign(
        {
          ref,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': props['aria-hidden'] ?? true,
          focusable: 'false',
        },
        props,
      ),
      children,
    );
  });
  return Icon;
}

const User = createIcon([
  React.createElement('path', { key: 'body', d: 'M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1' }),
  React.createElement('circle', { key: 'head', cx: 12, cy: 7, r: 4 }),
]);

const ArrowRight = createIcon([
  React.createElement('line', { key: 'line', x1: 5, y1: 12, x2: 19, y2: 12 }),
  React.createElement('polyline', { key: 'arrow', points: '12 5 19 12 12 19' }),
]);

const ArrowDown = createIcon([
  React.createElement('line', { key: 'line', x1: 12, y1: 5, x2: 12, y2: 19 }),
  React.createElement('polyline', { key: 'arrow', points: '5 12 12 19 19 12' }),
]);

const CheckCircle2 = createIcon([
  React.createElement('path', { key: 'circle', d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
  React.createElement('polyline', { key: 'check', points: '22 4 12 14.01 9 11' }),
]);

module.exports = {
  User,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  default: {
    User,
    ArrowRight,
    ArrowDown,
    CheckCircle2,
  },
};
