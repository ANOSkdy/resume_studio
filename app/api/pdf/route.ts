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

export async function POST(req: NextRequest) {
  let body: Payload | null = null;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const type = (body?.type ?? "resume") as PdfType;
  const template = (body?.template ?? "basic") as PdfTemplate;
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
  const bodyBytes =
    pdfBytes instanceof Uint8Array
      ? pdfBytes
      : pdfBytes instanceof ArrayBuffer
        ? new Uint8Array(pdfBytes)
        : Buffer.isBuffer(pdfBytes)
          ? new Uint8Array(pdfBytes)
          : new Uint8Array();

  return new NextResponse(bodyBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"ResumeStudio-Temp.pdf\"",
      "Cache-Control": "no-store",
    },
  });
}
