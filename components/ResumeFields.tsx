"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { PhotoUpload } from "./PhotoUpload";
import { HistoryFields } from "./HistoryFields";
import { QualificationFields } from "./QualificationFields";
import { generateAiTextAction } from "@/app/actions";

export function ResumeFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<IResumeFormData>();
  const resumeQuestions: Array<{
    field: "q1_resume" | "q2_resume" | "q3_resume" | "q4_resume" | "q5_resume";
    title: string;
    helper?: string;
  }> = [
    {
      field: "q1_resume",
      title: "1. 直近1〜2年であなたが主導して成果を出した出来事を1つ（S/T/A/Rを含めて）",
      helper: "状況・課題・行動・結果をひと続きのストーリーとしてまとめ、可能であれば数値など客観的な指標も記入してください。"
    },
    {
      field: "q2_resume",
      title: "2. 同僚や顧客が挙げる、あなたの強みTop3は？（裏付けとなる行動例も含めて）",
      helper: "強みとその根拠となる具体的な行動を一緒に記載してください。"
    },
    {
      field: "q3_resume",
      title: "3. あなたが最も力を発揮できる環境・役割・相手は？避けたい条件があれば併記してください。"
    },
    {
      field: "q4_resume",
      title: "4. 困難を乗り越えた経験から得た行動原則（口癖・ルール）は？"
    },
    {
      field: "q5_resume",
      title: "5. 今後1年で誰に／何の価値を／どの水準で提供したい？そのために既に行っている学習・実践もあれば記入してください。"
    }
  ];

  const handleGeneratePR = async () => {
    const q = [
      watch("q1_resume"), watch("q2_resume"), watch("q3_resume"), watch("q4_resume"), watch("q5_resume")
    ].map((v, i) => `Q${i+1}: ${v || ""}`).join("\n");
    const prompt = `以下の5つの回答をもとに日本語で200〜400字の自己PRを作成してください。\n${q}`;
    setLoadingText("AI自己PRを生成中です...");
    setLoading(true);
    try {
      const text = await generateAiTextAction(prompt);
      setValue("generated_resume_pr", text ?? "", { shouldDirty: true });
    } catch (e: any) {
      alert(`AI生成に失敗しました: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>基本情報</legend>
        <div className="form-grid form-grid-md-2">
          <div className="form-grid form-grid-md-2">
            <div>
              <label htmlFor="name">氏名</label>
              <input
                id="name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              {errors.name?.message && (
                <p id="name-error" role="alert" aria-live="polite" className="text-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="name-furigana">ふりがな</label>
              <input
                id="name-furigana"
                aria-invalid={Boolean(errors.name_furigana)}
                aria-describedby={errors.name_furigana ? "name-furigana-error" : undefined}
                {...register("name_furigana")}
              />
              {errors.name_furigana?.message && (
                <p id="name-furigana-error" role="alert" aria-live="polite" className="text-error">
                  {errors.name_furigana.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="birth-date">生年月日</label>
              <input
                id="birth-date"
                type="date"
                aria-invalid={Boolean(errors.birth_date)}
                aria-describedby={errors.birth_date ? "birth-date-error" : undefined}
                {...register("birth_date")}
              />
              {errors.birth_date?.message && (
                <p id="birth-date-error" role="alert" aria-live="polite" className="text-error">
                  {errors.birth_date.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="gender">性別</label>
              <select id="gender" {...register("gender")}>
                <option value="選択しない">選択しない</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>
          <div>
            <PhotoUpload />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>現住所</legend>
        <div className="form-grid form-grid-md-3">
          <div>
            <label htmlFor="address-furigana">ふりがな</label>
            <input
              id="address-furigana"
              autoComplete="address-line1"
              {...register("address_furigana")}
            />
          </div>
          <div>
            <label htmlFor="address-postal-code">郵便番号</label>
            <input
              id="address-postal-code"
              inputMode="numeric"
              autoComplete="postal-code"
              {...register("address_postal_code")}
            />
          </div>
          <div>
            <label htmlFor="address-main">住所</label>
            <input
              id="address-main"
              autoComplete="street-address"
              {...register("address_main")}
            />
          </div>
        </div>
        <div className="form-grid form-grid-md-2" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="phone">電話番号</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...register("phone")}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email?.message && (
              <p id="email-error" role="alert" aria-live="polite" className="text-error">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>連絡先（別）</legend>
        <div className="checkbox-field">
          <input id="same-as-current" type="checkbox" {...register("same_as_current_address")} />
          <label htmlFor="same-as-current">現住所と同じ</label>
        </div>
        <div className="form-grid form-grid-md-3">
          <div>
            <label htmlFor="contact-address-furigana">ふりがな</label>
            <input
              id="contact-address-furigana"
              {...register("contact_address_furigana")}
            />
          </div>
          <div>
            <label htmlFor="contact-address-postal-code">郵便番号</label>
            <input
              id="contact-address-postal-code"
              inputMode="numeric"
              autoComplete="postal-code"
              {...register("contact_address_postal_code")}
            />
          </div>
          <div>
            <label htmlFor="contact-address-main">住所</label>
            <input
              id="contact-address-main"
              autoComplete="street-address"
              {...register("contact_address_main")}
            />
          </div>
        </div>
        <div className="form-grid form-grid-md-2" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="contact-phone">電話番号</label>
            <input
              id="contact-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...register("contact_phone")}
            />
          </div>
          <div>
            <label htmlFor="contact-email">E-mail</label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.contact_email)}
              aria-describedby={errors.contact_email ? "contact-email-error" : undefined}
              {...register("contact_email")}
            />
            {errors.contact_email?.message && (
              <p id="contact-email-error" role="alert" aria-live="polite" className="text-error">
                {errors.contact_email.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <HistoryFields />
      <QualificationFields />

      <fieldset>
        <legend>AI自己PR</legend>
        <div className="resume-question-stack">
          {resumeQuestions.map(({ field, title, helper }, idx) => {
            const questionId = `resume-${field}`;
            const helperId = helper ? `${questionId}-helper` : undefined;
            return (
              <div key={field} className="resume-question-item">
                <label htmlFor={questionId} className="resume-question-label">{title}</label>
                {helper && (
                  <p id={helperId} className="resume-question-helper">{helper}</p>
                )}
                <textarea
                  id={questionId}
                  rows={helper ? 5 : 4}
                  aria-describedby={helperId}
                  placeholder={`Q${idx + 1}の回答を入力してください。`}
                  {...register(field)}
                />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="secondary-btn touch-target"
            onClick={handleGeneratePR}
            aria-label="AIで自己PRを生成"
          >
            AIで自己PRを生成
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <label htmlFor="generated-resume-pr">生成結果</label>
          <textarea
            id="generated-resume-pr"
            rows={6}
            {...register("generated_resume_pr")}
          ></textarea>
        </div>
      </fieldset>

      <fieldset>
        <legend>本人希望欄</legend>
        <label className="sr-only-important" htmlFor="special-requests">本人希望欄の入力</label>
        <textarea id="special-requests" rows={4} {...register("special_requests")}></textarea>
      </fieldset>
    </form>
  );
}
