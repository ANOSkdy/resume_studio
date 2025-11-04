"use client";

import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultScreen } from "@/components/ResultScreen";
import { LoadingModal } from "@/components/LoadingModal";
import { IResumeFormData } from "@/types";
import { mapFormDataToResumeInput } from "@/lib/pdf/mapFormDataToResumeInput";

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
        // Surface misconfigured middleware/auth flows rather than failing silently.
        throw new Error(
          `PDF API ${res.status} ${res.statusText}. CT=${contentType}. Body=${snippet.slice(0, 200)}`
        );
      }

      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
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
