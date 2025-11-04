import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Keep the section data minimal so we can extend it later without changing the API contract.
type Section = { title: string; items: string[] };
export type ResumeInput = { name: string; headline?: string; sections: Section[] };

export async function buildResumePdf(input: ResumeInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait keeps printing predictable.
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  page.drawText(input.name, { x: 50, y, size: 24, font: bold, color: rgb(0, 0, 0) });
  y -= 28;

  if (input.headline) {
    page.drawText(input.headline, { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
    y -= 24;
  }

  for (const sec of input.sections) {
    if (y < 80) {
      // Reset before drawing the next section to avoid clipping the header.
      y = 800;
      pdf.addPage([595.28, 841.89]);
    }
    page.drawText(sec.title, { x: 50, y, size: 16, font: bold });
    y -= 20;
    for (const line of sec.items) {
      page.drawText(`• ${line}`, { x: 60, y, size: 12, font });
      y -= 16;
      if (y < 60) {
        y = 800;
        pdf.addPage([595.28, 841.89]);
      }
    }
    y -= 12;
  }

  return pdf.save();
}
