import * as React from 'react';

function ensurePx(value) {
  if (typeof value === 'number') return `${value}px`;
  if (value === undefined) return '100%';
  return value;
}

export function ResponsiveContainer({ width = '100%', height = 240, style, children, ...rest }) {
  const merged = {
    width: ensurePx(width),
    height: ensurePx(height),
    position: 'relative',
    ...style,
  };
  return (
    <div style={merged} {...rest}>
      {children}
    </div>
  );
}

export function Tooltip() {
  return null;
}
Tooltip.__isRechartsTooltip = true;

export function XAxis() {
  return null;
}
XAxis.__isRechartsXAxis = true;

export function YAxis() {
  return null;
}
YAxis.__isRechartsYAxis = true;

export function Cell() {
  return null;
}
Cell.__isRechartsCell = true;

function parseRadius(radius) {
  if (Array.isArray(radius)) {
    return radius.map(v => (typeof v === 'number' ? `${v}px` : v || 0)).join(' ');
  }
  if (typeof radius === 'number') return `${radius}px`;
  return radius || 0;
}

export function BarChart({ data = [], children, style, barGap = 16 }) {
  const childArray = React.Children.toArray(children);
  const xAxis = childArray.find(child => React.isValidElement(child) && child.type && child.type.__isRechartsXAxis);
  const bar = childArray.find(child => React.isValidElement(child) && child.type && child.type.__isRechartsBar);
  const xKey = xAxis && React.isValidElement(xAxis) ? xAxis.props.dataKey : undefined;
  const barElement = bar && React.isValidElement(bar)
    ? React.cloneElement(bar, { data, xKey })
    : null;
  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: `${barGap}px`,
    width: '100%',
    height: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    ...style,
  };
  return <div style={containerStyle}>{barElement}</div>;
}
BarChart.__isRechartsBarChart = true;

export function Bar({ dataKey, fill = 'currentColor', radius = 0, data = [], xKey }) {
  const items = data.map((item, idx) => ({
    label: xKey ? item?.[xKey] : idx + 1,
    value: Number(item?.[dataKey] ?? 0),
  }));
  const max = Math.max(...items.map(item => item.value), 1);
  return items.map((item, idx) => {
    const height = max === 0 ? 0 : (item.value / max) * 100;
    return (
      <div
        key={`bar-${idx}`}
        style={{
          flex: 1,
          minWidth: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
          <div
            style={{
              width: '100%',
              height: `${height}%`,
              background: fill,
              borderRadius: parseRadius(radius),
              transition: 'height 0.3s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(15,23,42,0.72)', textAlign: 'center' }}>{item.label}</div>
      </div>
    );
  });
}
Bar.__isRechartsBar = true;

export function PieChart({ children, style }) {
  const merged = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };
  return <div style={merged}>{children}</div>;
}
PieChart.__isRechartsPieChart = true;

export function Pie({ data = [], dataKey, innerRadius = 0, outerRadius = 120, children }) {
  const fills = [];
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type && child.type.__isRechartsCell) {
      fills.push(child.props.fill);
    }
  });
  const total = data.reduce((sum, item) => sum + Number(item?.[dataKey] ?? 0), 0);
  let angleStart = 0;
  const segments = data.map((item, idx) => {
    const raw = Number(item?.[dataKey] ?? 0);
    const ratio = total === 0 ? 0 : raw / total;
    const angle = ratio * 360;
    const entry = {
      start: angleStart,
      end: angleStart + angle,
      fill: fills[idx % fills.length] || `hsl(${(idx * 72) % 360}deg 70% 60%)`,
    };
    angleStart += angle;
    return entry;
  });
  const gradient = segments
    .map(seg => `${seg.fill} ${seg.start}deg ${seg.end}deg`)
    .join(', ');
  const size = typeof outerRadius === 'number' ? outerRadius * 2 : 200;
  const inner = typeof innerRadius === 'number' ? innerRadius * 2 : 0;
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundImage: `conic-gradient(${gradient})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${inner}px`,
          height: `${inner}px`,
          borderRadius: '50%',
          background: 'var(--color-base, #fff)',
        }}
      />
    </div>
  );
}
Pie.__isRechartsPie = true;

export default {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
};
