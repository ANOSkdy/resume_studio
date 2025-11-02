interface ChartBarFlatProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
}

export default function ChartBarFlat<T extends Record<string, any>>({ data, xKey, yKey }: ChartBarFlatProps<T>) {
  const maxValue = Math.max(1, ...data.map((item) => Number(item[yKey]) || 0));

  return (
    <div className="chart-card">
      <div className="chart-bar-grid">
        {data.map((item) => {
          const value = Number(item[yKey]) || 0;
          const height = (value / maxValue) * 100;
          return (
            <div key={String(item[xKey])} className="chart-bar-column">
              <div className="chart-bar-fill" style={{ height: `${height}%` }} />
              <span>{String(item[xKey])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
