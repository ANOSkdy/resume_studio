import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import TransitionProvider from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "Resume Studio",
  description: "履歴書・職務経歴書の作成支援ツール",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
