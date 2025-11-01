'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type Props = {
  data: Record<string, number | string>[];
  nameKey: string;
  valueKey: string;
};

const PALETTE = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent1)',
  'var(--color-accent2)',
  'var(--color-accent3)',
];

export default function ChartPieFlat({ data, nameKey, valueKey }: Props) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} nameKey={nameKey} dataKey={valueKey} innerRadius={64} outerRadius={96} paddingAngle={3}>
            {data.map((_, index) => (
              <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
