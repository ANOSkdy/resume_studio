import SelfPrQuestionsForm from '@/components/forms/SelfPrQuestionsForm';

export const metadata = {
  title: '自己PRのための5つの質問',
};

export default function SelfPrPage() {
  return (
    <section>
      <header>
        <h1>自己PRのための5つの質問</h1>
        <p>
          最新の成果から将来の価値提供まで、自己PRに必要な情報を5問で整理できます。回答は自動保存され、再開も簡単です。
        </p>
      </header>
      <p style={{ margin: '0 0 24px', color: '#4b5563', fontSize: '0.95rem' }}>
        下書きはブラウザに保存されます。「保存して次へ」で生成ウィザードへ移動できます。
      </p>
      <SelfPrQuestionsForm />
    </section>
  );
}
