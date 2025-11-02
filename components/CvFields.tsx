"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { generateAiTextAction } from "@/app/actions";

export function CvFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();
  const cvQuestionFields = ["q1_cv", "q2_cv", "q3_cv", "q4_cv", "q5_cv"] as const;

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
        <div className="form-grid form-grid-md-2">
          {cvQuestionFields.map((fieldName, idx) => {
            const questionId = `cv-${fieldName}`;
            return (
              <div key={fieldName}>
                <label className="sr-only-important" htmlFor={questionId}>{`AI入力 Q${idx + 1}`}</label>
                <textarea
                  id={questionId}
                  rows={3}
                  placeholder={`Q${idx + 1}`}
                  {...register(fieldName)}
                />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="secondary-btn touch-target"
            onClick={handleGenerateCV}
            aria-label="AIで職務経歴書要素を一括生成"
          >
            AIで一括生成
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>AI生成結果</legend>
        <div className="form-grid">
          <div>
            <label htmlFor="generated-cv-summary">職務要約</label>
            <textarea id="generated-cv-summary" rows={4} {...register("generated_cv_summary")} />
          </div>
          <div>
            <label htmlFor="generated-cv-details">職務内容</label>
            <textarea id="generated-cv-details" rows={6} {...register("generated_cv_details")} />
          </div>
          <div>
            <label htmlFor="generated-cv-skills">活かせる経験・知識</label>
            <textarea id="generated-cv-skills" rows={4} {...register("generated_cv_skills")} />
          </div>
          <div>
            <label htmlFor="generated-cv-pr">自己PR</label>
            <textarea id="generated-cv-pr" rows={4} {...register("generated_cv_pr")} />
          </div>
        </div>
      </fieldset>
    </form>
  );
}
