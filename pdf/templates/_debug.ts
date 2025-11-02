import { PDFDocument, rgb } from "pdf-lib";
import { loadJapaneseFont } from "./_font";

export async function render(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const jp = await loadJapaneseFont(doc);
  const page = doc.addPage([595.28, 841.89]);
  let y = 780;
  page.drawText("Resume Studio PDF (test)", { x: 60, y, size: 26, font: jp, color: rgb(0,0,0) }); y -= 40;
  page.drawText(`Type: ${data?.__meta?.type ?? "unknown"}`, { x: 60, y, size: 18, font: jp }); y -= 22;
  page.drawText(`Name: ${data?.name ?? ""}`, { x: 60, y, size: 18, font: jp }); y -= 22;
  page.drawText(`Generated at: ${data?.__meta?.generatedAt ?? ""}`, { x: 60, y, size: 18, font: jp });
  return await doc.save();
}
