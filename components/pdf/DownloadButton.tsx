"use client";

type Props = { payload: unknown; label?: string };

export default function DownloadButton({ payload, label = "PDFプレビュー" }: Props) {
  const onClick = async () => {
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
      const loc = res.headers.get("location");
      throw new Error(`Unexpected redirect to: ${loc ?? "unknown"}`);
    }

    const ct = res.headers.get("content-type") ?? "";
    if (!res.ok || !ct.includes("application/pdf")) {
      const text = await res.text();
      // Logging the snippet helps diagnose misconfigured middleware or auth responses.
      throw new Error(`PDF API ${res.status} ${res.statusText}. CT=${ct}. Body=${text.slice(0, 200)}`);
    }

    const ab = await res.arrayBuffer();
    const blob = new Blob([ab], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  return <button onClick={onClick}>{label}</button>;
}
