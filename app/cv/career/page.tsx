import CareerQuestionsForm from '@/components/forms/CareerQuestionsForm';

export const metadata = { title: '職務経歴の入力（5問）' } satisfies { title: string };

export default function CareerPage() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">職務経歴のための5つの質問</h1>
      <p className="mb-6 text-sm text-gray-600">入力は自動保存されます。「保存して次へ」でウィザードに移動します。</p>
      <CareerQuestionsForm />
    </main>
  );
}
