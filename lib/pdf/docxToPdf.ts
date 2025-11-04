import path from "path";
import fs from "fs/promises";
import * as mammoth from "mammoth";

function escapeHtml(input: any) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replacePlaceholders(html: string, data: Record<string, any>) {
  // Replace {{ key }} placeholders with escaped values.
  for (const [key, val] of Object.entries(data || {})) {
    const re = new RegExp("\\{\\{\\s*" + escapeRegExp(key) + "\\s*\\}\\}", "g");
    html = html.replace(re, escapeHtml(val));
  }
  // Remove any unresolved placeholders.
  html = html.replace(/\{\{\s*[^}]+\s*\}\}/g, "");
  return html;
}

// Convert the DOCX template to HTML and inject the provided data.
export async function docxTemplateToPdf(template: "resume" | "cv", mapped: Record<string, any>) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "docs",
    template === "cv" ? "cv" : "resume",
    template === "cv" ? "cv.docx" : "resume.docx"
  );
  const buf = await fs.readFile(templatePath);
  const { value: html } = await mammoth.convertToHtml({ buffer: buf });
  return replacePlaceholders(html, mapped);
}
