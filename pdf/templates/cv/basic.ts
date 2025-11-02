import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import path from "node:path";
import { readFile } from "node:fs/promises";

type Project = { name?: string; role?: string; period?: string; detail?: string; tech?: string[] };

export async function render(data: any): Promise<Uint8Array> {
  const name = data?.name ?? "（氏名未入力）";
  const summary: string = data?.summary ?? "";
  const projects: Project[] = Array.isArray(data?.projects) ? data.projects : [];
  const skills: string[] = Array.isArray(data?.skills) ? data.skills : [];

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
  const fontBytes = await readFile(fontPath);
  const jp = await doc.embedFont(fontBytes, { subset: true });

  const page = doc.addPage([595.28, 841.89]); // A4
  const black = rgb(0, 0, 0);
  let y = 800;
  const left = 60;

  // Header
  page.drawText("職務経歴書 / Curriculum Vitae", { x: left, y, size: 22, font: jp, color: black });
  y -= 34;
  page.drawText(name, { x: left, y, size: 18, font: jp, color: black });
  y -= 26;

  // Summary
  page.drawText("サマリー / Summary", { x: left, y, size: 14, font: jp, color: black });
  y -= 18;
  page.drawText(summary || "—", { x: left, y, size: 11, font: jp, color: black });
  y -= 24;

  // Skills
  page.drawText("スキル / Skills", { x: left, y, size: 14, font: jp, color: black });
  y -= 18;
  page.drawText(skills.length ? skills.join(", ") : "—", { x: left, y, size: 11, font: jp, color: black });
  y -= 24;

  // Projects
  page.drawText("プロジェクト / Projects", { x: left, y, size: 14, font: jp, color: black });
  y -= 18;
  if (!projects.length) {
    page.drawText("—", { x: left, y, size: 11, font: jp, color: black });
  } else {
    for (const p of projects.slice(0, 8)) {
      page.drawText(`• ${p.period ?? ""}  ${p.name ?? ""}  ${p.role ?? ""}`, { x: left, y, size: 11, font: jp, color: black });
      y -= 14;
      if (p.detail) { page.drawText(`   ${p.detail}`, { x: left, y, size: 10, font: jp, color: black }); y -= 14; }
      if (p.tech?.length) { page.drawText(`   Tech: ${p.tech.join(", ")}`, { x: left, y, size: 10, font: jp, color: black }); y -= 14; }
      y -= 4;
      if (y < 120) break;
    }
  }

  return await doc.save();
}
