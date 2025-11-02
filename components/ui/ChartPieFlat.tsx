interface PieDatum {
  [key: string]: string | number;
}

interface ChartPieFlatProps<T extends PieDatum> {
  data: T[];
  nameKey: keyof T;
  valueKey: keyof T;
}

const PALETTE = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent1)",
  "var(--color-accent2)",
  "var(--color-accent3)",
];

export default function ChartPieFlat<T extends PieDatum>({ data, nameKey, valueKey }: ChartPieFlatProps<T>) {
  const total = data.reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0);
  let currentAngle = 0;
  const gradientSegments = data.map((item, index) => {
    const value = Number(item[valueKey]) || 0;
    const percentage = total === 0 ? 0 : (value / total) * 100;
    const start = currentAngle;
    const end = start + percentage;
    currentAngle = end;
    const color = PALETTE[index % PALETTE.length];
    return `${color} ${start}% ${end}%`;
  });

  const gradient = gradientSegments.length ? `conic-gradient(${gradientSegments.join(", ")})` : "conic-gradient(var(--color-primary) 0 100%)";

  return (
    <div className="chart-card">
      <div className="chart-pie-wrap">
        <div className="chart-pie-circle" style={{ background: gradient }} aria-hidden />
        <div className="chart-pie-legend">
          {data.map((item, index) => (
            <div key={String(item[nameKey])} className="chart-pie-legend-row">
              <span className="chart-pie-dot" style={{ background: PALETTE[index % PALETTE.length] }} />
              <span>{String(item[nameKey])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
