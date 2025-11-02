import { z } from "zod";

const historyEntrySchema = z.object({
  year: z.string().trim().optional().default(""),
  month: z.string().trim().optional().default(""),
  desc: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default(""),
});

const qualificationEntrySchema = z.object({
  year: z.string().trim().optional().default(""),
  month: z.string().trim().optional().default(""),
  desc: z.string().trim().optional().default(""),
});

const genderSchema = z
  .enum(["選択しない", "男", "女"], {
    invalid_type_error: "性別は '選択しない' | '男' | '女' から選択してください。",
  })
  .optional()
  .default("選択しない");

const textBlock = () => z.string().optional().transform(v => (v ?? "").trim()).default("");

export const resumePayloadSchema = z.object({
  photo: z
    .union([z.string(), z.null()])
    .optional()
    .transform(value => {
      const normalized = value === undefined ? null : value;
      if (!normalized) return null;
      const trimmed = String(normalized).trim();
      return trimmed.length === 0 ? null : trimmed;
    })
    .default(null),
  name: textBlock(),
  name_furigana: textBlock(),
  birth_date: textBlock(),
  gender: genderSchema,
  address_furigana: textBlock(),
  address_postal_code: textBlock(),
  address_main: textBlock(),
  phone: textBlock(),
  email: textBlock(),
  same_as_current_address: z.boolean().optional().default(false),
  contact_address_furigana: textBlock(),
  contact_address_postal_code: textBlock(),
  contact_address_main: textBlock(),
  contact_phone: textBlock(),
  contact_email: textBlock(),
  history: z.array(historyEntrySchema).optional().default([]),
  qualifications: z.array(qualificationEntrySchema).optional().default([]),
  q1_resume: textBlock(),
  q2_resume: textBlock(),
  q3_resume: textBlock(),
  q4_resume: textBlock(),
  q5_resume: textBlock(),
  generated_resume_pr: textBlock(),
  special_requests: textBlock(),
  q1_cv: textBlock(),
  q2_cv: textBlock(),
  q3_cv: textBlock(),
  q4_cv: textBlock(),
  q5_cv: textBlock(),
  generated_cv_summary: textBlock(),
  generated_cv_details: textBlock(),
  generated_cv_skills: textBlock(),
  generated_cv_pr: textBlock(),
});

export type ResumePdfPayload = z.infer<typeof resumePayloadSchema>;

export const pdfRequestBodySchema = z.object({
  type: z.string().min(1, "type is required"),
  payload: resumePayloadSchema,
});

export type PdfRequestBody = z.infer<typeof pdfRequestBodySchema>;
