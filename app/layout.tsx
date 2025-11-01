import './globals.css';
import type { Metadata } from 'next';
import TransitionProvider from '@/components/TransitionProvider';

export const metadata: Metadata = {
  title: 'Resume Studio',
  description: '履歴書・職務経歴書の作成支援ツール',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-base text-neutral-900">
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
