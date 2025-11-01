"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultScreen } from "@/components/ResultScreen";
import { LoadingModal } from "@/components/LoadingModal";
import { IResumeFormData } from "@/types";
import { generatePdfAction } from "@/app/actions";

function openPdfForPreview(base64Data: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Home() {
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
    } catch (e: any) {
      console.error(e);
      alert(`PDFの生成に失敗しました。\n${e?.message || e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <LoadingModal show={isLoading} message={loadingText} />
      <div style={{ display: screen === "form" ? "block" : "none" }}>
        <ResumeForm onConfirm={onConfirm} setLoading={setIsLoading} setLoadingText={setLoadingText} />
      </div>
      <div style={{ display: screen === "result" ? "block" : "none" }}>
        <ResultScreen onGeneratePdf={onGeneratePdf} onBack={() => setScreen("form")} />
      </div>
    </div>
  );
}
