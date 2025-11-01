"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";

export function QualificationFields() {
  const { control, register } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "qualifications" });

  return (
    <fieldset>
      <legend>免許・資格</legend>
      <div id="qualifications-container">
        {fields.map((field, index) => (
          <div key={field.id} className="entry-group qualifications-group">
            <input placeholder="年" {...register(`qualifications.${index}.year`)} />
            <input placeholder="月" {...register(`qualifications.${index}.month`)} />
            <input placeholder="資格名" {...register(`qualifications.${index}.desc`)} />
            <button type="button" className="remove-btn" onClick={() => remove(index)}>削除</button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="add-btn secondary-btn"
        onClick={() => append({ year: "", month: "", desc: "" })}
      >
        ＋ 免許・資格を追加
      </button>
    </fieldset>
  );
}
