// pages/api/pdf.ts
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

type Payload = {
  type?: PdfType;
  template?: PdfTemplate;
  data?: unknown;
  name?: string;
};

function norm(v: unknown) {
  return v == null ? "" : String(v).trim().toLowerCase();
}
function normalizeType(v: unknown): PdfType {
  return norm(v) === "cv" ? "cv" : "resume";
}
function normalizeTemplate(v: unknown): PdfTemplate {
  const s = norm(v);
  if (!s || s === "true" || s === "false" || s === "default" || s === "std" || s === "standard") return "basic";
  return s as PdfTemplate;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed. Use POST." });
    return;
  }

  let body: Payload | null = null;
  try {
    // Next.js API は JSON を既定でパースしますが、保険で両対応
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as Payload);
  } catch {
    res.status(400).send("Invalid JSON");
    return;
  }

  const type = normalizeType(body?.type);
  const template = normalizeTemplate(body?.template);
  const data = body?.data ?? {};

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
}
