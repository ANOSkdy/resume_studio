import path from "path";
import * as mammoth from "mammoth";
import { renderDocx } from "../docx/templater";

export async function docxTemplateToPdf(template: "resume" | "cv", data: any) {
  const templatePath = path.join(
    process.cwd(), "public", "docs",
    template === "cv" ? "cv" : "resume",
    template === "cv" ? "cv.docx" : "resume.docx"
  );
  const filled = await renderDocx(templatePath, data);
  const { value: html } = await mammoth.convertToHtml({ buffer: filled }); // docx → HTML
  return html;
}
