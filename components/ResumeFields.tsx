"use client";

import { useFormContext } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { PhotoUpload } from "./PhotoUpload";
import { HistoryFields } from "./HistoryFields";
import { QualificationFields } from "./QualificationFields";
import { generateAiTextAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";

export function ResumeFields({ setLoading, setLoadingText }: { setLoading: (b: boolean) => void; setLoadingText: (t: string) => void; }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<IResumeFormData>();
  const same = watch("same_as_current_address");
  const disableContact = !!same;

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
      alert(\`AI生成に失敗しました: \${e?.message || e}\`);
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
            <Field label="氏名" htmlFor="name" error={errors.name?.message as string}>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            </Field>
            <Field label="ふりがな" htmlFor="name_furigana" error={errors.name_furigana?.message as string}>
              <Input id="name_furigana" {...register("name_furigana")} aria-invalid={!!errors.name_furigana} />
            </Field>
            <Field label="生年月日" htmlFor="birth_date" error={errors.birth_date?.message as string}>
              <Input id="birth_date" type="date" {...register("birth_date")} aria-invalid={!!errors.birth_date} />
            </Field>
            <Field label="性別" htmlFor="gender">
              <Select id="gender" {...register("gender")}>
                <option value="選択しない">選択しない</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </Select>
            </Field>
          </div>
          <div>
            <PhotoUpload />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>現住所</legend>
        <div className="grid-3">
          <Field label="ふりがな" htmlFor="address_furigana">
            <Input id="address_furigana" {...register("address_furigana")} />
          </Field>
          <Field label="郵便番号" htmlFor="address_postal_code" hint="例：060-0000">
            <Input id="address_postal_code" {...register("address_postal_code")} inputMode="numeric" />
          </Field>
          <Field label="住所" htmlFor="address_main">
            <Input id="address_main" {...register("address_main")} />
          </Field>
        </div>
        <div className="grid-2" style={{ marginTop: 12 }}>
          <Field label="電話番号" htmlFor="phone">
            <Input id="phone" {...register("phone")} inputMode="tel" />
          </Field>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message as string}>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>連絡先（別）</legend>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="sameAddress">
            <Checkbox id="sameAddress" {...register("same_as_current_address")} />
            &nbsp;現住所と同じ
          </label>
        </div>
        <div className="grid-3" aria-disabled={disableContact}>
          <Field label="ふりがな" htmlFor="contact_address_furigana">
            <Input id="contact_address_furigana" {...register("contact_address_furigana")} disabled={disableContact} />
          </Field>
          <Field label="郵便番号" htmlFor="contact_address_postal_code">
            <Input id="contact_address_postal_code" {...register("contact_address_postal_code")} inputMode="numeric" disabled={disableContact} />
          </Field>
          <Field label="住所" htmlFor="contact_address_main">
            <Input id="contact_address_main" {...register("contact_address_main")} disabled={disableContact} />
          </Field>
        </div>
        <div className="grid-2" style={{ marginTop: 12 }} aria-disabled={disableContact}>
          <Field label="電話番号" htmlFor="contact_phone">
            <Input id="contact_phone" {...register("contact_phone")} inputMode="tel" disabled={disableContact} />
          </Field>
          <Field label="E-mail" htmlFor="contact_email" error={errors.contact_email?.message as string}>
            <Input id="contact_email" type="email" {...register("contact_email")} aria-invalid={!!errors.contact_email} disabled={disableContact} />
          </Field>
        </div>
      </fieldset>

      <HistoryFields />
      <QualificationFields />

      <fieldset>
        <legend>AI自己PR</legend>
        <div className="grid-2">
          <Field label="Q1" htmlFor="q1_resume"><Textarea id="q1_resume" {...register("q1_resume")} rows={3} /></Field>
          <Field label="Q2" htmlFor="q2_resume"><Textarea id="q2_resume" {...register("q2_resume")} rows={3} /></Field>
          <Field label="Q3" htmlFor="q3_resume"><Textarea id="q3_resume" {...register("q3_resume")} rows={3} /></Field>
          <Field label="Q4" htmlFor="q4_resume"><Textarea id="q4_resume" {...register("q4_resume")} rows={3} /></Field>
          <Field label="Q5" htmlFor="q5_resume"><Textarea id="q5_resume" {...register("q5_resume")} rows={3} /></Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button type="button" variant="secondary" onClick={handleGeneratePR}>AIで自己PRを生成</Button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="生成結果" htmlFor="generated_resume_pr">
            <Textarea id="generated_resume_pr" rows={6} {...register("generated_resume_pr")} />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>本人希望欄</legend>
        <Field htmlFor="special_requests">
          <Textarea id="special_requests" rows={4} {...register("special_requests")} />
        </Field>
      </fieldset>
    </form>
  );
}
