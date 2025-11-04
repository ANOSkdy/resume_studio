import type { NextApiRequest, NextApiResponse } from "next";
import { render as renderResume } from "../../pdf/templates/resume/basic";
import { render as renderCv } from "../../pdf/templates/cv/basic";
import { docxTemplateToPdf } from "../../lib/pdf/docxToPdf";
import { htmlToPdf } from "../../lib/pdf/htmlToPdf";
import { mapResumePlaceholders, mapCvPlaceholders } from "../../lib/pdf/mapPlaceholders";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const q = req.query || {};
    const body = req.method === "POST"
      ? (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {})
      : {};

    const template = (q.template as string) || body?.template || "resume"; // 'resume' | 'cv'
    const source = (q.source as string) || body?.source || "pdf-lib";      // 'docx' | 'pdf-lib'
    const data = body?.data ?? {};

    if (source === "docx") {
      const mapped = template === "cv" ? mapCvPlaceholders(data) : mapResumePlaceholders(data);
      const html = await docxTemplateToPdf(template === "cv" ? "cv" : "resume", mapped);
      const pdf = await htmlToPdf(html);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${template}.pdf"`);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).send(Buffer.from(pdf));
    }

    // 既存(pdf-lib)のテンプレも残す（fontkit登録済で日本語OK）
    const bytes = template === "cv" ? await renderCv(data) : await renderResume(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${template}.pdf"`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(bytes));
  } catch (e) {
    console.error("[api/pdf] error:", e);
    return res.status(500).json({ error: "PDF generation failed" });
  }
}
