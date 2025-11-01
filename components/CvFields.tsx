"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { generateAiTextAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";

export function CvFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue } = useFormContext<IResumeFormData>();

  const handleGenerateCV = async () => {
    const q = [watch("q1_cv"), watch("q2_cv"), watch("q3_cv"), watch("q4_cv"), watch("q5_cv")]
      .map((v, i) => `Q${i+1}: ${v || ""}`).join("\n");
    const prompt = `以下の回答を基に、職務経歴書向けの「職務要約」「職務内容」「活かせる経験・知識」「自己PR」をJSONで出力してください。キーは summary, details, skills, pr の4つ、日本語で簡潔に。\n${q}`;
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
      setValue("generated_cv_skills", parsed.skills ?? "", { shouldDirty: true });
      setValue("generated_cv_pr", parsed.pr ?? "", { shouldDirty: true });
    } catch (e: any) {
      alert(\`AI生成に失敗しました: \${e?.message || e}\`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>AI入力</legend>
        <div className="grid-2">
          <Field label="Q1" htmlFor="q1_cv"><Textarea id="q1_cv" {...register("q1_cv")} rows={3} /></Field>
          <Field label="Q2" htmlFor="q2_cv"><Textarea id="q2_cv" {...register("q2_cv")} rows={3} /></Field>
          <Field label="Q3" htmlFor="q3_cv"><Textarea id="q3_cv" {...register("q3_cv")} rows={3} /></Field>
          <Field label="Q4" htmlFor="q4_cv"><Textarea id="q4_cv" {...register("q4_cv")} rows={3} /></Field>
          <Field label="Q5" htmlFor="q5_cv"><Textarea id="q5_cv" {...register("q5_cv")} rows={3} /></Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button type="button" variant="secondary" onClick={handleGenerateCV}>AIで一括生成</Button>
        </div>
      </fieldset>

      <fieldset>
        <legend>AI生成結果</legend>
        <Field label="職務要約" htmlFor="generated_cv_summary"><Textarea id="generated_cv_summary" rows={4} {...register("generated_cv_summary")} /></Field>
        <Field label="職務内容" htmlFor="generated_cv_details"><Textarea id="generated_cv_details" rows={6} {...register("generated_cv_details")} /></Field>
        <Field label="活かせる経験・知識" htmlFor="generated_cv_skills"><Textarea id="generated_cv_skills" rows={4} {...register("generated_cv_skills")} /></Field>
        <Field label="自己PR" htmlFor="generated_cv_pr"><Textarea id="generated_cv_pr" rows={4} {...register("generated_cv_pr")} /></Field>
      </fieldset>
    </form>
  );
}
