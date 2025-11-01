"use client";
import { Button } from "@/components/ui/Button";

export function ResultScreen({ onGeneratePdf, onBack }: {
  onGeneratePdf: (docType: "resume" | "cv") => void;
  onBack: () => void;
}) {
  return (
    <div id="result-section">
      <h2>PDF生成</h2>
      <div style={{ display:"flex", gap:12, marginBottom:16 }}>
        <Button onClick={() => onGeneratePdf("resume")}>履歴書PDFを生成</Button>
        <Button onClick={() => onGeneratePdf("cv")}>職務経歴書PDFを生成</Button>
      </div>
      <Button variant="secondary" onClick={onBack}>戻る（入力フォームへ）</Button>
    </div>
  );
}
