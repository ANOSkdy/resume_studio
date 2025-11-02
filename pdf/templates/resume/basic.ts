import { PDFDocument, rgb } from "pdf-lib";
import { loadJapaneseFont } from "../_font";

type Contacts = { email?: string; phone?: string; address?: string };
type Education = { school?: string; degree?: string; period?: string };
type Job = { company?: string; role?: string; period?: string; summary?: string };

export async function render(data: any): Promise<Uint8Array> {
  const name = data?.name ?? "（氏名未入力）";
  const contacts: Contacts = data?.contacts ?? {};
  const educations: Education[] = Array.isArray(data?.educations) ? data.educations : [];
  const jobs: Job[] = Array.isArray(data?.jobs) ? data.jobs : [];

  const doc = await PDFDocument.create();
  const jp = await loadJapaneseFont(doc);

  const page = doc.addPage([595.28, 841.89]); // A4
  const black = rgb(0, 0, 0);
  let y = 800;
  const left = 60;

  page.drawText("履歴書 / Resume", { x: left, y, size: 22, font: jp, color: black });
  y -= 34;
  page.drawText(name, { x: left, y, size: 18, font: jp, color: black });
  y -= 22;

  const contactsLine = [
    contacts.email && `Email: ${contacts.email}`,
    contacts.phone && `Tel: ${contacts.phone}`,
    contacts.address && `Address: ${contacts.address}`,
  ].filter(Boolean).join("   ");
  if (contactsLine) {
    page.drawText(contactsLine, { x: left, y, size: 11, font: jp, color: black });
  }
  y -= 28;

  page.drawText("学歴 / Education", { x: left, y, size: 14, font: jp, color: black });
  y -= 18;
  if (!educations.length) {
    page.drawText("—", { x: left, y, size: 11, font: jp, color: black }); y -= 16;
  } else {
    for (const e of educations.slice(0, 6)) {
      page.drawText(`• ${e.period ?? ""}  ${e.school ?? ""}  ${e.degree ?? ""}`, { x: left, y, size: 11, font: jp, color: black });
      y -= 16;
    }
  }
  y -= 10;

  page.drawText("職歴 / Work Experience", { x: left, y, size: 14, font: jp, color: black });
  y -= 18;
  if (!jobs.length) {
    page.drawText("—", { x: left, y, size: 11, font: jp, color: black });
  } else {
    for (const j of jobs.slice(0, 7)) {
      page.drawText(`• ${j.period ?? ""}  ${j.company ?? ""}  ${j.role ?? ""}`, { x: left, y, size: 11, font: jp, color: black });
      y -= 14;
      if (j.summary) {
        page.drawText(`   ${j.summary}`, { x: left, y, size: 10, font: jp, color: black }); y -= 14;
      }
    }
  }

  return await doc.save();
}
