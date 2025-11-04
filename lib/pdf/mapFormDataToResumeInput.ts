import type { ResumeInput } from "@/lib/pdf/buildResumePdf";
import type { IHistoryEntry, IQualificationEntry, IResumeFormData } from "@/types";

function formatHistory(entry: IHistoryEntry): string {
  const when = [entry.year, entry.month].filter(Boolean).join("年");
  const detail = entry.status ? `${entry.desc} (${entry.status})` : entry.desc;
  return [when ? `${when}月` : null, detail].filter(Boolean).join(" ");
}

function formatQualification(entry: IQualificationEntry): string {
  const when = [entry.year, entry.month].filter(Boolean).join("年");
  return [when ? `${when}月` : null, entry.desc].filter(Boolean).join(" ");
}

function collectNonEmpty(values: (string | null | undefined)[]): string[] {
  return values.map((v) => v?.trim()).filter((v): v is string => Boolean(v && v.length > 0));
}

// The API keeps a tiny surface area (name/headline/sections) so we reshape the verbose form state here.
export function mapFormDataToResumeInput(
  formData: IResumeFormData,
  documentType: "resume" | "cv"
): ResumeInput {
  const sections: ResumeInput["sections"] = [];

  const contact = collectNonEmpty([
    formData.email ? `メール: ${formData.email}` : null,
    formData.phone ? `電話: ${formData.phone}` : null,
    formData.address_main ? `住所: ${formData.address_main}` : null
  ]);
  if (contact.length > 0) {
    sections.push({ title: "連絡先", items: contact });
  }

  const historyItems = formData.history.map(formatHistory).filter(Boolean);
  if (historyItems.length > 0) {
    sections.push({ title: "学歴・職歴", items: historyItems });
  }

  const qualificationItems = formData.qualifications.map(formatQualification).filter(Boolean);
  if (qualificationItems.length > 0) {
    sections.push({ title: "資格", items: qualificationItems });
  }

  const resumeNotes = collectNonEmpty([
    documentType === "resume" ? formData.generated_resume_pr : null,
    documentType === "resume" ? formData.q1_resume : null,
    documentType === "resume" ? formData.q2_resume : null,
    documentType === "resume" ? formData.q3_resume : null,
    documentType === "resume" ? formData.q4_resume : null,
    documentType === "resume" ? formData.q5_resume : null,
    documentType === "cv" ? formData.generated_cv_summary : null,
    documentType === "cv" ? formData.generated_cv_details : null,
    documentType === "cv" ? formData.generated_cv_skills : null,
    documentType === "cv" ? formData.generated_cv_pr : null,
    documentType === "cv" ? formData.generated_cv_speciality : null
  ]);
  if (resumeNotes.length > 0) {
    sections.push({ title: documentType === "resume" ? "自己PR" : "職務要約", items: resumeNotes });
  }

  const headline =
    documentType === "resume"
      ? formData.generated_resume_pr || formData.q1_resume
      : formData.generated_cv_summary;

  return {
    name: formData.name,
    headline: headline ?? undefined,
    sections
  };
}
