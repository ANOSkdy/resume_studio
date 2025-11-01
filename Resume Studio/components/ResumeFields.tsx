"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { PhotoUpload } from "./PhotoUpload";
import { HistoryFields } from "./HistoryFields";
import { QualificationFields } from "./QualificationFields";
import { generateAiTextAction } from "@/app/actions";

export function ResumeFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();

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
        <div className="grid-2">
          <div>
            <label>氏名</label>
            <input {...register("name")} />
            <label>ふりがな</label>
            <input {...register("name_furigana")} />
            <label>生年月日</label>
            <input type="date" {...register("birth_date")} />
            <label>性別</label>
            <select {...register("gender")}>
              <option value="選択しない">選択しない</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div>
            <PhotoUpload />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>現住所</legend>
        <div className="grid-3">
          <div>
            <label>ふりがな</label>
            <input {...register("address_furigana")} />
          </div>
          <div>
            <label>郵便番号</label>
            <input {...register("address_postal_code")} />
          </div>
          <div>
            <label>住所</label>
            <input {...register("address_main")} />
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 12 }}>
          <div>
            <label>電話番号</label>
            <input {...register("phone")} />
          </div>
          <div>
            <label>E-mail</label>
            <input type="email" {...register("email")} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>連絡先（別）</legend>
        <label>
          <input type="checkbox" {...register("same_as_current_address")} />
          &nbsp;現住所と同じ
        </label>
        <div className="grid-3">
          <div>
            <label>ふりがな</label>
            <input {...register("contact_address_furigana")} />
          </div>
          <div>
            <label>郵便番号</label>
            <input {...register("contact_address_postal_code")} />
          </div>
          <div>
            <label>住所</label>
            <input {...register("contact_address_main")} />
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 12 }}>
          <div>
            <label>電話番号</label>
            <input {...register("contact_phone")} />
          </div>
          <div>
            <label>E-mail</label>
            <input type="email" {...register("contact_email")} />
          </div>
        </div>
      </fieldset>

      <HistoryFields />
      <QualificationFields />

      <fieldset>
        <legend>AI自己PR</legend>
        <div className="grid-2">
          <textarea placeholder="Q1" {...register("q1_resume")} />
          <textarea placeholder="Q2" {...register("q2_resume")} />
          <textarea placeholder="Q3" {...register("q3_resume")} />
          <textarea placeholder="Q4" {...register("q4_resume")} />
          <textarea placeholder="Q5" {...register("q5_resume")} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="secondary-btn" onClick={handleGeneratePR}>AIで自己PRを生成</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>生成結果</label>
          <textarea rows={6} {...register("generated_resume_pr")}></textarea>
        </div>
      </fieldset>

      <fieldset>
        <legend>本人希望欄</legend>
        <textarea rows={4} {...register("special_requests")}></textarea>
      </fieldset>
    </form>
  );
}
