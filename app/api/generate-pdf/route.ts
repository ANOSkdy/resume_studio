import { NextRequest } from "next/server";
import { z } from "zod";
import { buildResumePdf } from "@/lib/pdf/buildResumePdf";

// Node.js runtime keeps pdf-lib stable: it needs Node streams/fonts unavailable on the Edge runtime.
export const runtime = "nodejs";
// Disable caching because each PDF is bespoke to the request payload.
export const dynamic = "force-dynamic";

const Input = z.object({
  name: z.string().min(1),
  headline: z.string().optional(),
  sections: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string())
      })
    )
    .default([])
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const input = Input.parse(json);
    const bytes = await buildResumePdf(input);

    // Convert to a Node.js Buffer so the Response constructor accepts the binary payload.
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "inline; filename=\"resume.pdf\"",
        "cache-control": "no-store"
      }
    });
  } catch (err: any) {
    console.error("[api/generate-pdf] error:", err);
    return Response.json(
      { error: "PDF generation failed", details: err?.message ?? String(err) },
      { status: 400 }
    );
  }
}
