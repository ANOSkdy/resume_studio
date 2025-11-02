"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultScreen } from "@/components/ResultScreen";
import { LoadingModal } from "@/components/LoadingModal";
import { generatePdfAction } from "@/app/actions";
import type { IResumeFormData } from "@/types";

function openPdfForPreview(base64Data: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function CVNewPage() {
  const [screen, setScreen] = useState<"form" | "result">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("処理を実行中です...");
  const [confirmedData, setConfirmedData] = useState<IResumeFormData | null>(null);

  const onConfirm = (data: IResumeFormData) => {
    setConfirmedData(data);
    setScreen("result");
  };

  const onGeneratePdf = async (documentType: "resume" | "cv") => {
    if (!confirmedData) {
      alert("データがありません。");
      return;
    }
    setLoadingText("PDFを生成中です...");
    setIsLoading(true);
    try {
      const base64Pdf = await generatePdfAction(confirmedData, documentType);
      openPdfForPreview(base64Pdf);
    } catch (error: any) {
      console.error(error);
      alert(`PDFの生成に失敗しました。\n${error?.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resume-stack">
      <header>
        <h1>職務経歴書テンプレート</h1>
        <p>入力フォームはデザイントークンを反映したテーマで整えています。履歴書と職務経歴書のタブを切り替えつつ、AI補助を活用してください。</p>
      </header>

      <div className="info-card">
        <img src="/illustrations/person-simple.svg" alt="イラスト" width={96} height={96} />
        <div>
          <strong>プレビューで確認しながら仕上げましょう</strong>
          <span>入力完了後はPDF生成ボタンからブラウザプレビューを開けます。控えめな影とフォーカスリングで視覚的に追いやすくなっています。</span>
        </div>
      </div>

      <div className="resume-stack">
        <LoadingModal show={isLoading} message={loadingText} />
        <div style={{ display: screen === "form" ? "block" : "none" }}>
          <ResumeForm onConfirm={onConfirm} setLoading={setIsLoading} setLoadingText={setLoadingText} />
        </div>
        <div style={{ display: screen === "result" ? "block" : "none" }}>
          <ResultScreen onGeneratePdf={onGeneratePdf} onBack={() => setScreen("form")} />
        </div>
      </div>
    </div>
  );
}
