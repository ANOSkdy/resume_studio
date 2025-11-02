import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
type Project = { name?: string; role?: string; period?: string; detail?: string; tech?: string[] };

export async function render(data: any): Promise<Uint8Array> {
  const name = data?.name ?? "（氏名未入力）";
  const summary: string = data?.summary ?? "";
  const projects: Project[] = Array.isArray(data?.projects) ? data.projects : [];
  const skills: string[] = Array.isArray(data?.skills) ? data.skills : [];

  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0,0,0);

  let y=800, left=60;
  page.drawText("職務経歴書 / Curriculum Vitae", { x:left, y, size:22, font:bold, color:black }); y-=34;
  page.drawText(name, { x:left, y, size:18, font:bold, color:black }); y-=26;

  page.drawText("サマリー / Summary", { x:left, y, size:14, font:bold, color:black }); y-=18;
  page.drawText(summary || "—", { x:left, y, size:11, font, color:black }); y-=24;

  page.drawText("スキル / Skills", { x:left, y, size:14, font:bold, color:black }); y-=18;
  page.drawText(skills.length ? skills.join(", ") : "—", { x:left, y, size:11, font, color:black }); y-=24;

  page.drawText("プロジェクト / Projects", { x:left, y, size:14, font:bold, color:black }); y-=18;
  if (!projects.length) { page.drawText("—", { x:left, y, size:11, font, color:black }); }
  else {
    for (const p of projects.slice(0,8)) {
      page.drawText(`• ${p.period ?? ""}  ${p.name ?? ""}  ${p.role ?? ""}`, { x:left, y, size:11, font, color:black }); y-=14;
      if (p.detail) { page.drawText(`   ${p.detail}`, { x:left, y, size:10, font, color:black }); y-=14; }
      if (p.tech?.length) { page.drawText(`   Tech: ${p.tech.join(", ")}`, { x:left, y, size:10, font, color:black }); y-=14; }
      y-=4; if (y < 120) break;
    }
  }
  return await doc.save();
}
