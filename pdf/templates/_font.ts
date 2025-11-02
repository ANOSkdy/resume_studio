import { PDFDocument, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import path from "node:path";
import { promises as fs } from "node:fs";

const CANDIDATES = [
  "NotoSansJP-Regular.ttf",
  "NotoSansJP-VariableFont_wght.ttf",
  "NotoSansJP-Regular.otf",
  "SourceHanSansJP-Regular.otf",
  "SourceHanSans-Regular.otf",
];

export async function loadJapaneseFont(doc: PDFDocument) {
  doc.registerFontkit(fontkit as any);
  for (const name of CANDIDATES) {
    const p = path.join(process.cwd(), "public", "fonts", name);
    try {
      const bytes = await fs.readFile(p);
      return await doc.embedFont(bytes, { subset: true });
    } catch { /* try next */ }
  }
  // 何も無ければ英数フォールバック（日本語は化けるので実フォントを必ず置いてください）
  return await doc.embedFont(StandardFonts.Helvetica);
}
