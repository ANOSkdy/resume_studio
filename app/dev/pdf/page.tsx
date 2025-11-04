import DownloadButton from "@/components/pdf/DownloadButton";

export default function Page() {
  const payload = {
    name: "Resume Studio",
    headline: "PDF generation smoke test",
    sections: [{ title: "Skills", items: ["Next.js", "TypeScript", "pdf-lib"] }]
  };
  return (
    <div style={{ padding: 24 }}>
      <h1>PDF Demo</h1>
      <DownloadButton payload={payload} label="PDFを開く" />
    </div>
  );
}
