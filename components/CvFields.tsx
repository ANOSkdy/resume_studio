"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { generateAiTextAction } from "@/app/actions";

export function CvFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();

  const handleGenerateCV = async () => {
    const [q1, q2, q3, q4, q5] = watch([
      "q1_cv",
      "q2_cv",
      "q3_cv",
      "q4_cv",
      "q5_cv"
    ]);
    const promptPayload = [q1, q2, q3, q4, q5]
      .map((value, index) => `Q${index + 1}: ${value || ""}`)
      .join("\n");
    const prompt = [
      "以下の回答を基に、職務経歴書向けの回答案をJSONで出力してください。",
      "以下のキーを必ず含め、値は日本語で簡潔にまとめてください。",
      "summary: 経歴概要",
      "details: 職務経験の詳細",
      "achievements: 定量的な実績",
      "evaluation: 他者評価",
      "speciality: 専門分野",
      promptPayload
    ].join("\n");
    setLoadingText("AIで職務経歴書要素を生成中です...");
    setLoading(true);
    try {
      const raw = await generateAiTextAction(prompt);
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const slice = jsonStart >= 0 && jsonEnd >= jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : "{}";
      const parsed = JSON.parse(slice);
      setValue("generated_cv_summary", parsed.summary ?? "", { shouldDirty: true });
      setValue("generated_cv_details", parsed.details ?? "", { shouldDirty: true });
      setValue("generated_cv_skills", parsed.achievements ?? parsed.skills ?? "", { shouldDirty: true });
      setValue("generated_cv_pr", parsed.evaluation ?? parsed.pr ?? "", { shouldDirty: true });
      setValue("generated_cv_speciality", parsed.speciality ?? parsed.specialty ?? "", { shouldDirty: true });
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
      <section className="cv-questions-stack" aria-labelledby="cv-questions-title">
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
            required
            aria-required="true"
            aria-describedby="q1-cv-help"
            rows={4}
            className="cv-question-input"
            {...register("q1_cv")}
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
            required
            aria-required="true"
            aria-describedby="q2-cv-help"
            rows={6}
            className="cv-question-input"
            {...register("q2_cv")}
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
            aria-describedby="q3-cv-help"
            rows={3}
            className="cv-question-input"
            {...register("q3_cv")}
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
            aria-describedby="q4-cv-help"
            rows={3}
            className="cv-question-input"
            {...register("q4_cv")}
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
            aria-describedby="q5-cv-help"
            className="cv-question-input"
            type="text"
            {...register("q5_cv")}
          />
        </div>
      </section>
      <span
        aria-hidden="true"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: "<!-- CV_QUESTIONS:END -->" }}
      />

      <fieldset>
        <legend>AI生成結果</legend>
        <div className="cv-questions-stack" aria-live="polite" aria-describedby="cv-answers-note">
          <p id="cv-answers-note" className="cv-answers-note">
            各質問に対するAIからの提案です。必要に応じて編集してください。
          </p>

          <div className="cv-question-field">
            <label htmlFor="generated-cv-summary" className="cv-question-label">
              1) 経歴概要（AI提案）
            </label>
            <textarea
              id="generated-cv-summary"
              rows={4}
              className="cv-question-input"
              {...register("generated_cv_summary")}
            />
          </div>

          <div className="cv-question-field">
            <label htmlFor="generated-cv-details" className="cv-question-label">
              2) 職務経験の詳細（AI提案）
            </label>
            <textarea
              id="generated-cv-details"
              rows={6}
              className="cv-question-input"
              {...register("generated_cv_details")}
            />
          </div>

          <div className="cv-question-field">
            <label htmlFor="generated-cv-skills" className="cv-question-label">
              3) 定量的な実績（AI提案）
            </label>
            <textarea
              id="generated-cv-skills"
              rows={4}
              className="cv-question-input"
              {...register("generated_cv_skills")}
            />
          </div>

          <div className="cv-question-field">
            <label htmlFor="generated-cv-pr" className="cv-question-label">
              4) 他者評価（AI提案）
            </label>
            <textarea
              id="generated-cv-pr"
              rows={4}
              className="cv-question-input"
              {...register("generated_cv_pr")}
            />
          </div>

          <div className="cv-question-field">
            <label htmlFor="generated-cv-speciality" className="cv-question-label">
              5) 専門分野（AI提案）
            </label>
            <textarea
              id="generated-cv-speciality"
              rows={3}
              className="cv-question-input"
              {...register("generated_cv_speciality")}
            />
          </div>
        </div>

        <div className="cv-answers-actions">
          <button
            type="button"
            className="secondary-btn touch-target"
            onClick={handleGenerateCV}
            aria-label="AIで職務経歴書の提案文を生成"
          >
            AIで提案を生成
          </button>
        </div>
      </fieldset>
    </form>
  );
}
