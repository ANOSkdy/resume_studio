import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export async function render(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let y = 780;
  page.drawText("Resume Studio PDF (test)", { x: 60, y, size: 26, font, color: rgb(0,0,0) }); y -= 40;
  page.drawText(`Type: ${data?.__meta?.type ?? "unknown"}`, { x: 60, y, size: 18, font }); y -= 22;
  page.drawText(`Name: ${data?.name ?? ""}`, { x: 60, y, size: 18, font }); y -= 22;
  page.drawText(`Generated at: ${data?.__meta?.generatedAt ?? ""}`, { x: 60, y, size: 18, font });
  return await doc.save();
}
