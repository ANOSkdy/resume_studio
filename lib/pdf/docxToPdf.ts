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
  // dataの各キーに対して {{ key }} を置換（空白は任意）
  for (const [key, val] of Object.entries(data || {})) {
    const re = new RegExp("\\{\\{\\s*" + escapeRegExp(key) + "\\s*\\}\\}", "g");
    html = html.replace(re, escapeHtml(val));
  }
  // 残った未知の {{ ... }} は空文字に
  html = html.replace(/\{\{\s*[^}]+\s*\}\}/g, "");
  return html;
}

// 返り値：置換済みHTML
export async function docxTemplateToPdf(template: "resume" | "cv", mapped: Record<string, any>) {
  const templatePath = path.join(
    process.cwd(), "public", "docs",
    template === "cv" ? "cv" : "resume",
    template === "cv" ? "cv.docx" : "resume.docx"
  );
  const buf = await fs.readFile(templatePath);
  const { value: html } = await mammoth.convertToHtml({ buffer: buf }); // docx→HTML
  return replacePlaceholders(html, mapped); // HTML内を {{key}} 置換
}
