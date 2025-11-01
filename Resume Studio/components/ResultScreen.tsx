"use client";

export function ResultScreen({ onGeneratePdf, onBack }: {
  onGeneratePdf: (docType: "resume" | "cv") => void;
  onBack: () => void;
}) {
  return (
    <div id="result-section">
      <h2>PDF生成</h2>
      <div style={{ display:"flex", gap:12, marginBottom:16 }}>
        <button className="primary-btn" onClick={() => onGeneratePdf("resume")}>履歴書PDFを生成</button>
        <button className="primary-btn" onClick={() => onGeneratePdf("cv")}>職務経歴書PDFを生成</button>
      </div>
      <button className="secondary-btn" onClick={onBack}>戻る（入力フォームへ）</button>
    </div>
  );
}
