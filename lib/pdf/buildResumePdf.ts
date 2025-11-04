import { PDFDocument, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "fs/promises";
import path from "path";

// Keep the section data minimal so we can extend it later without changing the API contract.
type Section = { title: string; items: string[] };
export type ResumeInput = { name: string; headline?: string; sections: Section[] };

const PAGE_SIZE: [number, number] = [595.28, 841.89]; // A4 portrait keeps printing predictable.
const PAGE_SIDE_MARGIN = 50;
const PAGE_TOP_MARGIN = 40;
const PAGE_BOTTOM_MARGIN = 60;
const FONT_DIRECTORY = path.join(process.cwd(), "public", "fonts");
const FONT_FILES = {
  regular: "NotoSansJP-Regular.ttf",
  // Embed the same glyph set for headings so Japanese text survives regardless of weight selection.
  bold: "NotoSansJP-Regular.ttf",
} as const;

const fontDataCache: Record<string, Promise<Uint8Array>> = {};

async function getFontData(fileName: string): Promise<Uint8Array> {
  if (!fontDataCache[fileName]) {
    const filePath = path.join(FONT_DIRECTORY, fileName);
    fontDataCache[fileName] = readFile(filePath).then((buffer) => new Uint8Array(buffer));
  }
  return fontDataCache[fileName];
}

async function loadFonts(pdf: PDFDocument): Promise<{ regular: PDFFont; bold: PDFFont }> {
  // pdf-lib ships with WinAnsi fonts only. Register fontkit so we can embed Unicode fonts like Noto Sans JP.
  pdf.registerFontkit(fontkit);

  const regularBytes = await getFontData(FONT_FILES.regular);
  const regular = await pdf.embedFont(regularBytes, { subset: true });

  if (FONT_FILES.bold === FONT_FILES.regular) {
    return { regular, bold: regular };
  }

  const boldBytes = await getFontData(FONT_FILES.bold);
  const bold = await pdf.embedFont(boldBytes, { subset: true });

  return { regular, bold };
}

type DrawOptions = { font: PDFFont; size: number; x?: number };

export async function buildResumePdf(input: ResumeInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  let page = pdf.addPage(PAGE_SIZE);
  const fonts = await loadFonts(pdf);
  const textColor = rgb(0, 0, 0);

  let y = PAGE_SIZE[1] - PAGE_TOP_MARGIN;
  const bulletIndent = PAGE_SIDE_MARGIN + 10;

  const ensureSpace = (lineHeight: number) => {
    if (y - lineHeight < PAGE_BOTTOM_MARGIN) {
      page = pdf.addPage(PAGE_SIZE);
      y = PAGE_SIZE[1] - PAGE_TOP_MARGIN;
    }
  };

  const moveCursor = (lineHeight: number) => {
    ensureSpace(lineHeight);
    y -= lineHeight;
  };

  const drawLine = (text: string, { font, size, x }: DrawOptions, lineHeight: number) => {
    ensureSpace(lineHeight);
    page.drawText(text, {
      x: x ?? PAGE_SIDE_MARGIN,
      y,
      font,
      size,
      color: textColor,
    });
    y -= lineHeight;
  };

  drawLine(input.name, { font: fonts.bold, size: 24 }, 28);

  if (input.headline) {
    drawLine(input.headline, { font: fonts.regular, size: 14 }, 24);
  }

  for (const sec of input.sections) {
    moveCursor(10); // Breathing room between sections for readability.
    drawLine(sec.title, { font: fonts.bold, size: 16 }, 22);

    for (const line of sec.items) {
      drawLine(`• ${line}`, { font: fonts.regular, size: 12, x: bulletIndent }, 16);
    }
  }

  return pdf.save();
}
