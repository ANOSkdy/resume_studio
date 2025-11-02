import CareerQuestionsForm from '@/components/forms/CareerQuestionsForm';

export const metadata = { title: '職務経歴の入力（5問）' } satisfies { title: string };

export default function CareerPage() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">職務経歴のための5つの質問</h1>
      <p className="text-sm text-gray-600">
        各設問に答えることで、職務経歴書を高精度に生成するための必要十分な情報を集めます。
      </p>
      <ol className="mb-6 mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
        <li>職務要約：経験年数・担当領域・業界や規模感・強みを3〜5行でまとめる</li>
        <li>直近ポジションの基本情報：会社名、在籍期間、雇用形態、役職、チーム規模など</li>
        <li>主要責務と利用技術：日々の業務内容、使用スキル/ツール、成果物を整理する</li>
        <li>成果エピソード：目標→行動→結果→数値の順に最大3件、役割を添えて記録する</li>
        <li>今後の志向と提供価値：希望職種・業界、働き方、提供価値と根拠を1年スパンで記す</li>
      </ol>
      <p className="mb-6 text-sm text-gray-600">入力は数秒以内に自動保存されます。「保存して次へ」でウィザードに移動します。</p>
      <CareerQuestionsForm />
    </main>
  );
}
