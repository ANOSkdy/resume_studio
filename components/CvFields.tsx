"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { generateAiTextAction } from "@/app/actions";

export function CvFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();

  const handleGenerateCV = async () => {
    const q = [watch("q1_cv"), watch("q2_cv"), watch("q3_cv"), watch("q4_cv"), watch("q5_cv")]
      .map((v, i) => `Q${i+1}: ${v || ""}`).join("\n");
    const prompt = `以下の回答を基に、職務経歴書向けの「職務要約」「職務内容」「活かせる経験・知識」「自己PR」をJSONで出力してください。
キーは summary, details, skills, pr の4つにしてください。日本語で簡潔に。\n${q}`;
    setLoadingText("AIで職務経歴書要素を生成中です...");
    setLoading(true);
    try {
      const raw = await generateAiTextAction(prompt);
      // 生成がプレーンテキストの場合もあるため簡易パース
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const slice = jsonStart >= 0 && jsonEnd >= jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : "{}";
      const parsed = JSON.parse(slice);
      setValue("generated_cv_summary", parsed.summary ?? "", { shouldDirty: true });
      setValue("generated_cv_details", parsed.details ?? "", { shouldDirty: true });
      setValue("generated_cv_skills", parsed.skills ?? "", { shouldDirty: true });
      setValue("generated_cv_pr", parsed.pr ?? "", { shouldDirty: true });
    } catch (e: any) {
      alert(`AI生成に失敗しました: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>AI入力</legend>
        <div className="grid-2">
          <textarea placeholder="Q1" {...register("q1_cv")} />
          <textarea placeholder="Q2" {...register("q2_cv")} />
          <textarea placeholder="Q3" {...register("q3_cv")} />
          <textarea placeholder="Q4" {...register("q4_cv")} />
          <textarea placeholder="Q5" {...register("q5_cv")} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="secondary-btn" onClick={handleGenerateCV}>AIで一括生成</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>AI生成結果</legend>
        <label>職務要約</label>
        <textarea rows={4} {...register("generated_cv_summary")} />
        <label>職務内容</label>
        <textarea rows={6} {...register("generated_cv_details")} />
        <label>活かせる経験・知識</label>
        <textarea rows={4} {...register("generated_cv_skills")} />
        <label>自己PR</label>
        <textarea rows={4} {...register("generated_cv_pr")} />
      </fieldset>
    </form>
  );
}
