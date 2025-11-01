import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Studio",
  description: "履歴書・職務経歴書の作成支援ツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="theme-green">
      <body>
        <a href="#main" className="skip-link">本文へスキップ</a>
        <main id="main" role="main">{children}</main>
      </body>
    </html>
  );
}
