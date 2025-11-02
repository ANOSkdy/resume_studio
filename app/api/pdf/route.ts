export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { z } from "zod";

import { Buffer } from "node:buffer";

import { render as renderCvBasic } from "@/pdf/templates/cv/basic";
import { render as renderResumeBasic } from "@/pdf/templates/resume/basic";

const FONT_CANDIDATES = [
  "NotoSansJP-Regular.ttf",
  "NotoSansJP-VariableFont_wght.ttf",
  "NotoSansJP-Regular.otf",
  "SourceHanSansJP-Regular.otf",
  "SourceHanSans-Regular.otf",
] as const;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
  Pragma: "no-cache",
};

const withNoStoreHeaders = (extra: Record<string, string> = {}) => ({
  ...noCacheHeaders,
  ...extra,
});

const PayloadSchema = z
  .object({
    type: z.union([z.string(), z.null()]).optional(),
    template: z.union([z.string(), z.null()]).optional(),
    data: z.record(z.any()).optional(),
    name: z.string().trim().min(1).optional(),
  })
  .passthrough();

type PdfRenderer = (
  data: Record<string, unknown>
) => Promise<Uint8Array | ArrayBuffer | Buffer> | Uint8Array | ArrayBuffer | Buffer;

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizeType = (value: unknown): "resume" | "cv" => {
  const v = normalize(value);
  return v === "cv" ? "cv" : "resume";
};

const normalizeTemplate = (value: unknown): string => {
  const v = normalize(value);
  if (!v || v === "true" || v === "false" || v === "default" || v === "std" || v === "standard") {
    return "basic";
  }
  return v;
};

const FONT_ERROR_RESPONSE = new Response(
  JSON.stringify({ error: "FONT_NOT_FOUND", path: "public/fonts" }),
  {
    status: 422,
    headers: {
      "Content-Type": "application/json",
      ...noCacheHeaders,
    },
  }
);

async function ensureFontAvailable() {
  for (const candidate of FONT_CANDIDATES) {
    const candidatePath = path.join(process.cwd(), "public", "fonts", candidate);
    try {
      await fs.access(candidatePath);
      return candidatePath;
    } catch {
      continue;
    }
  }
  throw new Error("FONT_NOT_FOUND");
}

const rendererTable: Record<string, PdfRenderer> = {
  "resume:basic": renderResumeBasic,
  "cv:basic": renderCvBasic,
};

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: withNoStoreHeaders({ "Content-Type": "application/json" }),
  });

function toUint8Array(pdfBytes: Awaited<ReturnType<PdfRenderer>>): Uint8Array {
  if (Buffer.isBuffer(pdfBytes)) {
    return new Uint8Array(pdfBytes.buffer, pdfBytes.byteOffset, pdfBytes.byteLength);
  }
  if (pdfBytes instanceof Uint8Array) {
    return pdfBytes;
  }
  if (pdfBytes instanceof ArrayBuffer) {
    return new Uint8Array(pdfBytes);
  }
  return new Uint8Array();
}

async function handleGenerate(payload: unknown) {
  const parsed = PayloadSchema.safeParse(payload);
  if (!parsed.success) {
    console.warn("[PDF] payload schema error", parsed.error.issues);
    return jsonResponse({ error: "INVALID_PAYLOAD", issues: parsed.error.issues }, 422);
  }

  const raw = parsed.data;
  const type = normalizeType(raw.type);
  const template = normalizeTemplate(raw.template);

  const rendererKey = `${type}:${template}`;
  const renderer = rendererTable[rendererKey];

  if (!renderer) {
    console.warn("[PDF] unsupported template", { rendererKey });
    return jsonResponse({ error: "UNSUPPORTED_TEMPLATE", template, type }, 422);
  }

  try {
    await ensureFontAvailable();
  } catch (error) {
    console.error("[PDF] font not found");
    return FONT_ERROR_RESPONSE;
  }

  const name = typeof raw.name === "string" ? raw.name : undefined;
  const data = raw.data ?? {};

  const payloadForTemplate = {
    ...(typeof data === "object" && data !== null ? data : {}),
    __meta: { type, template, generatedAt: new Date().toISOString() },
    name: name ?? "",
  } as Record<string, unknown>;

  try {
    const pdfBytes = await renderer(payloadForTemplate);
    const buffer = toUint8Array(pdfBytes);
    const body = buffer.slice().buffer;
    const safeName = (name ?? type).replace(/[^a-z0-9\-_.]/gi, "_") || type;

    return new Response(body, {
      status: 200,
      headers: withNoStoreHeaders({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeName || "resume"}.pdf"`,
        "x-rs-pdf-path": "live",
      }),
    });
  } catch (error: any) {
    console.error("[PDF] generation failed", error?.message ?? error);
    return jsonResponse({ error: "PDF_GENERATION_FAILED" }, 500);
  }
}

export async function POST(req: NextRequest) {
  console.log("[PDF] start", {
    method: "POST",
    url: req.nextUrl.pathname,
    search: req.nextUrl.search,
  });

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    console.warn("[PDF] invalid JSON body");
    return jsonResponse({ error: "INVALID_JSON" }, 400);
  }

  return handleGenerate(payload);
}

export async function GET(req: NextRequest) {
  console.log("[PDF] start", {
    method: "GET",
    url: req.nextUrl.pathname,
    search: req.nextUrl.search,
  });

  const { searchParams } = req.nextUrl;
  const payloadB64 = searchParams.get("payload");

  if (payloadB64) {
    try {
      const jsonString = Buffer.from(payloadB64, "base64").toString("utf8");
      const parsed = JSON.parse(jsonString);
      return handleGenerate(parsed);
    } catch (error) {
      console.warn("[PDF] invalid payload base64", error);
      return jsonResponse({ error: "INVALID_PAYLOAD_BASE64" }, 400);
    }
  }

  const type = searchParams.get("type") ?? undefined;
  const template = searchParams.get("template") ?? undefined;
  const nameParam = searchParams.get("name") ?? undefined;
  const name = nameParam && nameParam.trim() ? nameParam : undefined;

  const dataEntries = Array.from(searchParams.entries())
    .filter(([key]) => key.startsWith("data."))
    .reduce<Record<string, unknown>>((acc, [key, value]) => {
      const dataKey = key.slice("data.".length);
      if (dataKey) {
        acc[dataKey] = value;
      }
      return acc;
    }, {});

  return handleGenerate({
    type,
    template,
    name,
    data: Object.keys(dataEntries).length ? dataEntries : undefined,
  });
}
