"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultScreen } from "@/components/ResultScreen";
import { LoadingModal } from "@/components/LoadingModal";
import type { IResumeFormData } from "@/types";

async function requestPdf(templateType: "resume" | "career", payload: IResumeFormData) {
  const response = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: templateType, payload }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      const error = await response.json();
      throw new Error(error?.error || "PDF生成APIの呼び出しに失敗しました。");
    }
    const text = await response.text();
    throw new Error(text || "PDF生成APIの呼び出しに失敗しました。");
  }

  return await response.blob();
}

function openPdfForPreview(blob: Blob) {
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
      const templateType = documentType === "cv" ? "career" : "resume";
      const pdfBlob = await requestPdf(templateType, confirmedData);
      openPdfForPreview(pdfBlob);
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
