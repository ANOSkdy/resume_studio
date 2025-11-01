"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function QualificationFields() {
  const { control, register } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "qualifications" });

  return (
    <fieldset>
      <legend>免許・資格</legend>
      <div id="qualifications-container">
        {fields.map((field, index) => {
          const base = `qualifications.${index}`;
          return (
            <div key={field.id} className="entry-group qualifications-group" style={{ gridTemplateColumns: "80px 80px 1fr auto", gap: "8px" }}>
              <Field label="年" htmlFor={`q-year-${index}`}>
                <Input id={`q-year-${index}`} placeholder="年" {...register(`${base}.year`)} />
              </Field>
              <Field label="月" htmlFor={`q-month-${index}`}>
                <Input id={`q-month-${index}`} placeholder="月" {...register(`${base}.month`)} />
              </Field>
              <Field label="資格名" htmlFor={`q-desc-${index}`}>
                <Input id={`q-desc-${index}`} placeholder="資格名" {...register(`${base}.desc`)} />
              </Field>
              <Button type="button" variant="ghost" aria-label="この行を削除" onClick={() => remove(index)}>削除</Button>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ year: "", month: "", desc: "" })}
      >
        ＋ 免許・資格を追加
      </Button>
    </fieldset>
  );
}
