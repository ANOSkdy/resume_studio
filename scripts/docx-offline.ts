import { writeFileSync } from "node:fs";
import { docxTemplateToPdf } from "../lib/pdf/docxToPdf";
import { htmlToPdf } from "../lib/pdf/htmlToPdf";
import { mapResumePlaceholders } from "../lib/pdf/mapPlaceholders";

(async () => {
  const html = await docxTemplateToPdf("resume", mapResumePlaceholders({
    date_created: "2025-11-03",
    name_furigana: "‚â‚Ü‚¾ ‚½‚ë‚¤",
    name: "R“c ‘¾˜Y",
    birth_year: "1995", birth_month: "04", birth_day: "12", age: "30",
    address_postal_code: "060-0000", address_main: "D–ysc",
    phone: "090-1234-5678", email: "taro@example.com",
    generated_pr: "Ó”CŠ´‚ÆŒp‘±—Í‚ª‹­‚İ‚Å‚·B", special_requests: "ƒŠƒ‚[ƒg‹Î–±‚ğŠó–]",
  }));
  const pdf = await htmlToPdf(html);
  writeFileSync("resume-docx-offline.pdf", Buffer.from(pdf));
  console.log("Wrote: resume-docx-offline.pdf");
})();
