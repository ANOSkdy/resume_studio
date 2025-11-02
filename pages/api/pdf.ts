// pages/api/pdf.ts  ←この内容で全置換
import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "node:buffer";
import { render as renderResumeBasic } from "../../pdf/templates/resume/basic";
import { render as renderCvBasic } from "../../pdf/templates/cv/basic";
import { render as renderDebug } from "../../pdf/templates/_debug";

type PdfType = "resume" | "cv";
type PdfTemplate = "basic" | string;
type PdfRenderer = (
  data: unknown
) => Promise<Uint8Array | ArrayBuffer | Buffer> | Uint8Array | ArrayBuffer | Buffer;

type Payload = { type?: PdfType; template?: PdfTemplate; data?: unknown; name?: string };

const norm = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());
const normalizeType = (v: unknown): PdfType => (norm(v) === "cv" ? "cv" : "resume");
const normalizeTemplate = (v: unknown): PdfTemplate => {
  const s = norm(v);
  if (!s || s === "true" || s === "false" || s === "default" || s === "std" || s === "standard") return "basic";
  return s as PdfTemplate;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed. Use POST." });
      return;
    }

    let body: Payload | string | null = req.body as any;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { /* ignore */ }
    }

    const type = normalizeType((body as any)?.type);
    const template = normalizeTemplate((body as any)?.template);
    const data = (body as any)?.data ?? {};

    const table: Record<string, PdfRenderer> = {
      "resume:basic": renderResumeBasic,
      "cv:basic": renderCvBasic,
    };

    const key = `${type}:${template}`;
    const renderer = table[key] ?? renderDebug;

    const payloadForTemplate = {
      ...((typeof data === "object" && data) || {}),
      __meta: { type, template, generatedAt: new Date().toISOString() },
      name: (data as any)?.name ?? (body as any)?.name ?? "",
    };

    const pdfBytes = await renderer(payloadForTemplate);
    const buf = Buffer.isBuffer(pdfBytes)
      ? pdfBytes
      : pdfBytes instanceof Uint8Array
        ? Buffer.from(pdfBytes)
        : pdfBytes instanceof ArrayBuffer
          ? Buffer.from(new Uint8Array(pdfBytes))
          : Buffer.alloc(0);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="ResumeStudio-Temp.pdf"');
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(buf);
  } catch (e: any) {
    console.error("[/api/pdf] error:", e);
    res.status(500).json({ error: "PDF_RENDER_ERROR", message: String(e?.message ?? e) });
  }
}
