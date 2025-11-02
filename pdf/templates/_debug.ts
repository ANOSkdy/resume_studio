import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import path from "node:path";
import { readFile } from "node:fs/promises";

export async function render(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
  const fontBytes = await readFile(fontPath);
  const jp = await doc.embedFont(fontBytes, { subset: true });

  const page = doc.addPage([595.28, 841.89]); // A4
  let y = 780;

  page.drawText("Resume Studio PDF (test)", { x: 60, y, size: 26, font: jp, color: rgb(0,0,0) });
  y -= 40;
  page.drawText(`Type: ${data?.__meta?.type ?? "unknown"}`, { x: 60, y, size: 18, font: jp });
  y -= 22;
  page.drawText(`Name: ${data?.name ?? ""}`, { x: 60, y, size: 18, font: jp });
  y -= 22;
  page.drawText(`Generated at: ${data?.__meta?.generatedAt ?? ""}`, { x: 60, y, size: 18, font: jp });

  return await doc.save();
}
