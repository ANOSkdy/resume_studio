import Section from '@/components/ui/Section';
import ProcessFlow from '@/components/ui/ProcessFlow';
import ChartBarFlat from '@/components/ui/ChartBarFlat';
import ChartPieFlat from '@/components/ui/ChartPieFlat';
import { CheckCircle2, User } from 'lucide-react';

const pieData = [
  { name: 'A', value: 40 },
  { name: 'B', value: 24 },
  { name: 'C', value: 36 },
];

const barData = [
  { label: 'Mon', value: 3 },
  { label: 'Tue', value: 5 },
  { label: 'Wed', value: 2 },
  { label: 'Thu', value: 4 },
];

export default function StyleguidePage() {
  return (
    <main className="styleguide-main">
      <h1>Styleguide</h1>

      <Section title="Palette" subtitle="CSS Variables & Token Mapping" pattern="dots">
        <div className="palette-grid">
          {['base', 'primary', 'secondary', 'accent1', 'accent2', 'accent3'].map(key => (
            <div key={key} className="palette-card">
              <div className="palette-swatch" style={{ background: `var(--color-${key})` }} />
              <div style={{ fontWeight: 600 }}>{key}</div>
              <div className="text-neutral-500" style={{ fontSize: '0.85rem' }}>{`var(--color-${key})`}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icons & Shadows" subtitle="2px stroke + fill" pattern="waves">
        <div className="icon-row">
          <User className="icon-2px" width={32} height={32} color="var(--color-primary)" />
          <CheckCircle2 className="icon-2px" width={32} height={32} color="var(--color-accent2)" />
          <div className="soft-shadow" style={{ padding: '12px 20px', borderRadius: '14px', background: '#fff' }}>soft-shadow</div>
        </div>
      </Section>

      <Section title="Process Flow (Horizontal)">
        <ProcessFlow
          direction="horizontal"
          steps={[
            { title: '入力', description: '基本情報', icon: <User width={24} height={24} /> },
            { title: '確認', description: 'プレビュー' },
            { title: '出力', description: 'PDF生成' },
          ]}
        />
      </Section>

      <Section title="Process Flow (Vertical)">
        <ProcessFlow
          direction="vertical"
          steps={[
            { title: '企画', description: 'ヒアリング' },
            { title: '制作', description: 'テンプレート調整' },
            { title: 'リリース', description: '公開 & フィードバック' },
          ]}
        />
      </Section>

      <Section title="Charts (Flat)">
        <div className="chart-grid">
          <ChartPieFlat data={pieData} nameKey="name" valueKey="value" />
          <ChartBarFlat data={barData} xKey="label" yKey="value" />
        </div>
      </Section>

      <Section title="Illustration">
        <div className="illustration-preview">
          <img src="/illustrations/person-simple.svg" alt="person" width={160} height={160} />
        </div>
      </Section>
    </main>
  );
}
