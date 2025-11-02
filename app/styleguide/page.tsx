"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import ProcessFlow from "@/components/ui/ProcessFlow";
import ChartBarFlat from "@/components/ui/ChartBarFlat";
import ChartPieFlat from "@/components/ui/ChartPieFlat";
import { CheckCircleIcon, UserIcon } from "@/components/ui/icons";

const pieData = [
  { name: "Planning", value: 40 },
  { name: "Design", value: 24 },
  { name: "Build", value: 36 },
];

const barData = [
  { day: "Mon", count: 3 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 4 },
  { day: "Fri", count: 6 },
];

export default function StyleguidePage() {
  return (
    <main className="styleguide-grid" style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
      <header>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Styleguide</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>デザイントークンとコンポーネントの確認ページです。</p>
      </header>

      <Section title="Palette" subtitle="CSS Variables & カラーバランス" pattern="dots">
        <div className="styleguide-palette">
          {["base", "primary", "secondary", "accent1", "accent2", "accent3"].map((token) => (
            <div key={token} className="styleguide-palette-item">
              <div style={{ height: 48, borderRadius: 12, marginBottom: 12, background: `var(--color-${token})` }} />
              <div style={{ fontWeight: 600 }}>{token}</div>
              <TokenValue token={token} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icons & Shadows" subtitle="2px線画と柔らかい影" pattern="waves">
        <div className="styleguide-icon-row">
          <UserIcon className="icon-2px" width={42} height={42} />
          <CheckCircleIcon className="icon-2px text-accent2" width={42} height={42} />
          <span className="soft-shadow" style={{ padding: "12px 18px", borderRadius: 16, background: "#fff" }}>soft-shadow</span>
        </div>
      </Section>

      <Section title="Process Flow" subtitle="水平レイアウト">
        <ProcessFlow
          steps={[
            { title: "入力", description: "基本情報", icon: <UserIcon width={24} height={24} /> },
            { title: "確認", description: "プレビュー確認" },
            { title: "出力", description: "PDF生成" },
          ]}
        />
      </Section>

      <Section title="Charts" subtitle="フラットスタイルの可視化">
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <ChartPieFlat data={pieData} nameKey="name" valueKey="value" />
          <ChartBarFlat data={barData} xKey="day" yKey="count" />
        </div>
      </Section>

      <Section title="Illustration" subtitle="軽いアクセント">
        <img src="/illustrations/person-simple.svg" alt="イラスト" width={160} height={160} />
      </Section>
    </main>
  );
}

function TokenValue({ token }: { token: string }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const computed = getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim();
    setValue(computed);
  }, [token]);

  return <small style={{ color: "#6b7280" }}>{value}</small>;
}
