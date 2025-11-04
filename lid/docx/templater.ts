import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs/promises";

export async function renderDocx(templatePath: string, data: Record<string, any>) {
  const content = await fs.readFile(templatePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.setData(data);
  doc.render();
  return doc.getZip().generate({ type: "nodebuffer" }) as Buffer;
}
