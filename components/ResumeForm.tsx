"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IResumeFormData } from "@/types";
import { ResumeFields } from "./ResumeFields";
import { CvFields } from "./CvFields";

const resumeFormSchema = z.object({
  name: z.string().min(1, "氏名は必須です。"),
  name_furigana: z.string().min(1, "ふりがなは必須です。"),
  birth_date: z.string().min(1, "生年月日は必須です。"),
  history: z.array(z.object({
    year: z.string(),
    month: z.string(),
    desc: z.string(),
    status: z.string(),
  })).default([]),
  qualifications: z.array(z.object({
    year: z.string(),
    month: z.string(),
    desc: z.string(),
  })).default([]),

  photo: z.string().nullable().default(null),
  gender: z.enum(["選択しない", "男", "女"]).default("選択しない"),
  address_furigana: z.string().default(""),
  address_postal_code: z.string().default(""),
  address_main: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().email("有効なE-mailを入力してください。").or(z.literal("")).default(""),

  same_as_current_address: z.boolean().default(true),
  contact_address_furigana: z.string().default(""),
  contact_address_postal_code: z.string().default(""),
  contact_address_main: z.string().default(""),
  contact_phone: z.string().default(""),
  contact_email: z.string().email("有効なE-mailを入力してください。").or(z.literal("")).default(""),

  q1_resume: z.string().default(""),
  q2_resume: z.string().default(""),
  q3_resume: z.string().default(""),
  q4_resume: z.string().default(""),
  q5_resume: z.string().default(""),
  generated_resume_pr: z.string().default(""),

  special_requests: z.string().default(""),

  q1_cv: z.string().default(""),
  q2_cv: z.string().default(""),
  q3_cv: z.string().default(""),
  q4_cv: z.string().default(""),
  q5_cv: z.string().default(""),

  generated_cv_summary: z.string().default(""),
  generated_cv_details: z.string().default(""),
  generated_cv_skills: z.string().default(""),
  generated_cv_pr: z.string().default(""),
  generated_cv_speciality: z.string().default("")
});

interface Props {
  onConfirm: (data: IResumeFormData) => void;
  setLoading: (isLoading: boolean) => void;
  setLoadingText: (text: string) => void;
}

export function ResumeForm({ onConfirm, setLoading, setLoadingText }: Props) {
  const [activeTab, setActiveTab] = useState<"resume" | "cv">("resume");

  const methods = useForm<IResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      same_as_current_address: true,
      history: [{ year: "", month: "", desc: "", status: "入社" }],
      qualifications: [{ year: "", month: "", desc: "" }],
      gender: "選択しない",
      special_requests: "貴社規定に従います。"
    }
  });

  const onSubmit = (data: IResumeFormData) => {
    if (data.same_as_current_address) {
      data.contact_address_furigana = data.address_furigana;
      data.contact_address_postal_code = data.address_postal_code;
      data.contact_address_main = data.address_main;
      data.contact_phone = data.phone;
      data.contact_email = data.email;
    }
    const processedHistory = data.history.map(h => ({ ...h, desc: `${h.desc} ${h.status}`.trim() }));
    const processedQualifications = data.qualifications.map(q => ({ ...q, desc: q.desc ? `${q.desc} 取得` : "" }));

    onConfirm({ ...data, history: processedHistory, qualifications: processedQualifications });
  };

  const handleConfirmClick = () => {
    methods.handleSubmit(onSubmit, (errors) => {
      console.error("フォームバリデーションエラー:", errors);
      alert("未入力または不正な形式の必須項目があります。");
    })();
  };

  return (
    <FormProvider {...methods}>
      <div id="form-section">
        <div className="tab-container">
          <button type="button" id="tab-resume-btn" className={`tab-btn ${activeTab === "resume" ? "active" : ""}`} onClick={() => setActiveTab("resume")}>履歴書</button>
          <button type="button" id="tab-cv-btn" className={`tab-btn ${activeTab === "cv" ? "active" : ""}`} onClick={() => setActiveTab("cv")}>職務経歴書</button>
        </div>

        <div style={{ display: activeTab === "resume" ? "block" : "none" }}>
          <ResumeFields setLoading={setLoading} setLoadingText={setLoadingText} />
        </div>

        <div style={{ display: activeTab === "cv" ? "block" : "none" }}>
          <CvFields setLoading={setLoading} setLoadingText={setLoadingText} />
        </div>

        <button type="button" id="confirm-btn" className="primary-btn" onClick={handleConfirmClick}>
          入力内容を確定してPDF生成へ
        </button>
      </div>
    </FormProvider>
  );
}
