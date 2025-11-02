export const runtime = "nodejs";

import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { render as renderResumeBasic } from "@/pdf/templates/resume/basic";
import { render as renderCvBasic } from "@/pdf/templates/cv/basic";
import { render as renderDebug } from "@/pdf/templates/_debug";

type PdfType = "resume" | "cv";
type PdfTemplate = "basic" | string;
type PdfRenderer = (
  data: unknown,
) => Promise<Uint8Array | ArrayBuffer | Buffer> | Uint8Array | ArrayBuffer | Buffer;

type Payload = {
  type?: PdfType;
  template?: PdfTemplate;
  data?: unknown;
  name?: string;
};

function badRequest(msg = "Bad Request") {
  return new NextResponse(msg, { status: 400 });
}

function normString(v: unknown): string {
  if (v == null) return "";
  try {
    return String(v).trim().toLowerCase();
  } catch {
    return "";
  }
}

function normalizeType(v: unknown): PdfType {
  const s = normString(v);
  if (s === "cv") return "cv";
  return "resume";
}

function normalizeTemplate(v: unknown): PdfTemplate {
  const s = normString(v);
  if (!s || s === "true" || s === "false") return "basic";
  if (s === "default" || s === "std" || s === "standard") return "basic";
  return s as PdfTemplate;
}

export async function POST(req: NextRequest) {
  let body: Payload | null = null;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
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
  const responseBuffer = Buffer.isBuffer(pdfBytes)
    ? pdfBytes
    : pdfBytes instanceof Uint8Array
      ? Buffer.from(pdfBytes)
      : pdfBytes instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(pdfBytes))
        : Buffer.alloc(0);

  const responseBody = Uint8Array.from(responseBuffer).buffer;

  return new NextResponse(responseBody, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"ResumeStudio-Temp.pdf\"",
      "Cache-Control": "no-store",
    },
  });
}
