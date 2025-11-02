"use client";

import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { generateAiTextAction } from "@/app/actions";

export function CvFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();
  const cvQuestionFields = ["q1_cv", "q2_cv", "q3_cv", "q4_cv", "q5_cv"] as const;
  const q1Value = watch("q1_cv");
  const q2Value = watch("q2_cv");
  const q3Value = watch("q3_cv");
  const q4Value = watch("q4_cv");
  const q5Value = watch("q5_cv");

  const handleCvFieldChange = (
    field: (typeof cvQuestionFields)[number]
  ) =>
    (
      event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      setValue(field, event.target.value, {
        shouldDirty: true,
        shouldTouch: true
      });
    };

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
      <span
        aria-hidden="true"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: "<!-- CV_QUESTIONS:BEGIN -->" }}
      />
      <section
        className="cv-questions-stack"
        aria-labelledby="cv-questions-title"
      >
        <h2 id="cv-questions-title" className="cv-questions-heading">
          職務経歴書入力（5つの質問）
        </h2>

        <div className="cv-question-field">
          <label htmlFor="q1-cv" className="cv-question-label">
            1) 経歴概要 <span aria-hidden="true" className="cv-required-indicator">*</span>
          </label>
          <p id="q1-cv-help" className="cv-question-help">
            3〜5行想定。経験年数／担当領域／規模感／強みなど。
          </p>
          <textarea
            id="q1-cv"
            name="q1-cv"
            required
            aria-required="true"
            aria-describedby="q1-cv-help"
            rows={4}
            value={q1Value || ""}
            onChange={handleCvFieldChange("q1_cv")}
            className="cv-question-input"
          />
        </div>

        <div className="cv-question-field">
          <label htmlFor="q2-cv" className="cv-question-label">
            2) 職務経験の詳細 <span aria-hidden="true" className="cv-required-indicator">*</span>
          </label>
          <p id="q2-cv-help" className="cv-question-help">
            プロジェクト／役割／期間／規模／担当範囲など。
          </p>
          <textarea
            id="q2-cv"
            name="q2-cv"
            required
            aria-required="true"
            aria-describedby="q2-cv-help"
            rows={6}
            value={q2Value || ""}
            onChange={handleCvFieldChange("q2_cv")}
            className="cv-question-input"
          />
        </div>

        <div className="cv-question-field">
          <label htmlFor="q3-cv" className="cv-question-label">
            3) 定量的な実績（任意）
          </label>
          <p id="q3-cv-help" className="cv-question-help">
            例: 売上+15%／コスト▲12%／工数-30h/月 等
          </p>
          <textarea
            id="q3-cv"
            name="q3-cv"
            aria-describedby="q3-cv-help"
            rows={3}
            value={q3Value || ""}
            onChange={handleCvFieldChange("q3_cv")}
            className="cv-question-input"
          />
        </div>

        <div className="cv-question-field">
          <label htmlFor="q4-cv" className="cv-question-label">
            4) 他者評価（任意）
          </label>
          <p id="q4-cv-help" className="cv-question-help">
            上司/同僚/顧客からの評価や表彰など。
          </p>
          <textarea
            id="q4-cv"
            name="q4-cv"
            aria-describedby="q4-cv-help"
            rows={3}
            value={q4Value || ""}
            onChange={handleCvFieldChange("q4_cv")}
            className="cv-question-input"
          />
        </div>

        <div className="cv-question-field">
          <label htmlFor="q5-cv" className="cv-question-label">
            5) 専門分野（任意）
          </label>
          <p id="q5-cv-help" className="cv-question-help">
            得意領域やスキル群（カンマ区切り可）。
          </p>
          <input
            id="q5-cv"
            name="q5-cv"
            aria-describedby="q5-cv-help"
            value={q5Value || ""}
            onChange={handleCvFieldChange("q5_cv")}
            className="cv-question-input"
            type="text"
          />
        </div>
      </section>
      <span
        aria-hidden="true"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: "<!-- CV_QUESTIONS:END -->" }}
      />

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
