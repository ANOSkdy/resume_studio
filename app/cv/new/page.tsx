"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultScreen } from "@/components/ResultScreen";
import { LoadingModal } from "@/components/LoadingModal";
import type { IResumeFormData } from "@/types";
import { mapFormDataToResumeInput } from "@/lib/pdf/mapFormDataToResumeInput";

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
      const payload = mapFormDataToResumeInput(confirmedData, documentType);
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/pdf"
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        redirect: "manual"
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        throw new Error(`Unexpected redirect to: ${location ?? "unknown"}`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.includes("application/pdf")) {
        const snippet = await res.text();
        // Align client checks with /api logic so 30x HTML pages are caught early.
        throw new Error(
          `PDF API ${res.status} ${res.statusText}. CT=${contentType}. Body=${snippet.slice(0, 200)}`
        );
      }

      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
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
        <p>
          入力フォームはデザイントークンを反映したテーマで整えています。履歴書と職務経歴書のタブを切り替えつつ、AI補助を活用して
          ください。
        </p>
      </header>

      <div className="info-card">
        <img src="/illustrations/person-simple.svg" alt="イラスト" width={96} height={96} />
        <div>
          <strong>プレビューで確認しながら仕上げましょう</strong>
          <span>
            入力完了後はPDF生成ボタンからブラウザプレビューを開けます。控えめな影とフォーカスリングで視覚的に追いやすくなっています。
          </span>
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
