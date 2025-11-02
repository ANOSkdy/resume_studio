import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { resolveTemplate } from "@/lib/pdf/template-registry";
import { pdfRequestBodySchema, resumePayloadSchema } from "@/lib/pdf/schema";
import { resolvePayloadPlaceholders } from "@/lib/pdf/placeholder";
import { registerNotoSansJp } from "@/lib/pdf/fonts/notoSansJp";

export const runtime = "nodejs";

type ParsedRequest = {
  type: string;
  payload: unknown;
};

function parseQueryPayload(request: NextRequest): ParsedRequest {
  const params = request.nextUrl.searchParams;
  const type = params.get("type") ?? "";
  const payloadParam = params.get("payload");
  if (!payloadParam) {
    return { type, payload: {} };
  }
  try {
    const parsed = JSON.parse(payloadParam);
    return { type, payload: parsed };
  } catch (error) {
    throw new Error("Failed to parse payload query parameter as JSON");
  }
}

async function parseBodyPayload(request: NextRequest): Promise<ParsedRequest> {
  try {
    const json = await request.json();
    const parsed = pdfRequestBodySchema.parse(json);
    return { type: parsed.type, payload: parsed.payload };
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return Promise.reject(new Error(error.errors?.[0]?.message ?? "Invalid payload"));
    }
    return Promise.reject(new Error("Invalid JSON body"));
  }
}

async function handleRequest(request: NextRequest): Promise<Response> {
  const isDebug =
    request.nextUrl.searchParams.get("debug") === "1" ||
    request.headers.get("x-pdf-debug") === "1";

  let parsed: ParsedRequest;
  if (request.method === "GET") {
    parsed = parseQueryPayload(request);
  } else {
    parsed = await parseBodyPayload(request);
  }

  const { type, payload } = parsed;
  let template;
  try {
    template = resolveTemplate(type);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid template" }, { status: 400 });
  }

  let payloadData;
  try {
    payloadData = resumePayloadSchema.parse(payload ?? {});
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors?.[0]?.message ?? "Invalid payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const resolvedPayload = resolvePayloadPlaceholders(payloadData);

  console.info("[pdf] render", {
    template: template.key,
    debug: isDebug,
    name: resolvedPayload.name,
    historyCount: resolvedPayload.history.length,
    qualificationCount: resolvedPayload.qualifications.length,
  });

  if (isDebug) {
    return NextResponse.json({
      template: template.key,
      payload: resolvedPayload,
    });
  }

  registerNotoSansJp();

  const element = React.createElement(template.component, { data: resolvedPayload });

  let buffer: Uint8Array;
  try {
    const rendered = await renderToBuffer(element);
    buffer = rendered instanceof Uint8Array ? rendered : new Uint8Array(rendered as ArrayBufferLike);
  } catch (error: any) {
    console.error("[pdf] render error", {
      template: template.key,
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: "PDFテンプレートのレンダリングに失敗しました。" },
      { status: 500 },
    );
  }

  const normalizedBuffer =
    buffer.byteOffset === 0 && buffer.byteLength === buffer.buffer.byteLength
      ? buffer
      : buffer.slice();
  const arrayBuffer = normalizedBuffer.buffer.slice(0) as ArrayBuffer;

  const pdfResponse = new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(normalizedBuffer.byteLength ?? 0),
      "Content-Disposition": `inline; filename=${template.key}.pdf`,
      "Cache-Control": "no-store",
    },
  });

  return pdfResponse;
}

export async function GET(request: NextRequest) {
  try {
    return await handleRequest(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate PDF" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handleRequest(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate PDF" }, { status: 400 });
  }
}
