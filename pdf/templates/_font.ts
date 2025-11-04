import type { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";

export async function loadJapaneseFont(doc: PDFDocument) {
  // 日本語が欠ける/バラける対策
  // @ts-ignore
  doc.registerFontkit(fontkit);
  const p = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
  const bytes = await fs.readFile(p);
  return await doc.embedFont(bytes, { subset: true });
}
