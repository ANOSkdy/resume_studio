'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

type Props = {
  data: Record<string, number | string>[];
  xKey: string;
  yKey: string;
};

export default function ChartBarFlat({ data, xKey, yKey }: Props) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip cursor={{}} />
          <Bar dataKey={yKey} fill="var(--color-primary)" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
