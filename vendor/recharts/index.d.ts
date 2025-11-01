import * as React from 'react';

type ContainerProps = {
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export function ResponsiveContainer(props: ContainerProps): JSX.Element;

export interface XAxisProps {
  dataKey?: string;
}
export function XAxis(props: XAxisProps): null;

export function YAxis(props?: Record<string, unknown>): null;

export interface TooltipProps {
  cursor?: unknown;
}
export function Tooltip(props: TooltipProps): null;

export interface BarChartProps {
  data?: any[];
  children?: React.ReactNode;
  style?: React.CSSProperties;
  barGap?: number;
}
export function BarChart(props: BarChartProps): JSX.Element;

export interface BarProps {
  dataKey: string;
  fill?: string;
  radius?: number | (number | string)[] | string;
}
export function Bar(props: BarProps): React.ReactNode;

export interface CellProps {
  fill?: string;
}
export function Cell(props: CellProps): null;

export interface PieChartProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PieChart(props: PieChartProps): JSX.Element;

export interface PieProps {
  data?: any[];
  dataKey: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  children?: React.ReactNode;
}
export function Pie(props: PieProps): JSX.Element;

declare const _default: {
  ResponsiveContainer: typeof ResponsiveContainer;
  BarChart: typeof BarChart;
  Bar: typeof Bar;
  XAxis: typeof XAxis;
  YAxis: typeof YAxis;
  Tooltip: typeof Tooltip;
  PieChart: typeof PieChart;
  Pie: typeof Pie;
  Cell: typeof Cell;
};
export default _default;
