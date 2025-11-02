"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";

export function QualificationFields() {
  const { control, register, formState: { errors } } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "qualifications" });

  return (
    <fieldset>
      <legend>免許・資格</legend>
      <div id="qualifications-container">
        {fields.map((field, index) => {
          const qualificationError = errors.qualifications?.[index];

          return (
            <div key={field.id} className="array-item">
              <div className="form-grid form-grid-md-3">
                <div>
                  <label htmlFor={`qualification-${index}-year`}>年</label>
                  <input
                    id={`qualification-${index}-year`}
                    placeholder="年"
                    inputMode="numeric"
                    aria-invalid={Boolean(qualificationError?.year)}
                    aria-describedby={qualificationError?.year ? `qualification-${index}-year-error` : undefined}
                    {...register(`qualifications.${index}.year` as const)}
                  />
                  {qualificationError?.year?.message && (
                    <p id={`qualification-${index}-year-error`} role="alert" aria-live="polite" className="text-error">
                      {qualificationError.year?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`qualification-${index}-month`}>月</label>
                  <input
                    id={`qualification-${index}-month`}
                    placeholder="月"
                    inputMode="numeric"
                    aria-invalid={Boolean(qualificationError?.month)}
                    aria-describedby={qualificationError?.month ? `qualification-${index}-month-error` : undefined}
                    {...register(`qualifications.${index}.month` as const)}
                  />
                  {qualificationError?.month?.message && (
                    <p id={`qualification-${index}-month-error`} role="alert" aria-live="polite" className="text-error">
                      {qualificationError.month?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`qualification-${index}-desc`}>資格名</label>
                  <input
                    id={`qualification-${index}-desc`}
                    placeholder="資格名"
                    aria-invalid={Boolean(qualificationError?.desc)}
                    aria-describedby={qualificationError?.desc ? `qualification-${index}-desc-error` : undefined}
                    {...register(`qualifications.${index}.desc` as const)}
                  />
                  {qualificationError?.desc?.message && (
                    <p id={`qualification-${index}-desc-error`} role="alert" aria-live="polite" className="text-error">
                      {qualificationError.desc?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="array-item-actions">
                <button
                  type="button"
                  className="remove-btn touch-target array-remove-btn"
                  onClick={() => remove(index)}
                  aria-label="免許・資格の行を削除"
                >
                  削除
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="add-btn secondary-btn touch-target array-add-btn"
        onClick={() => append({ year: "", month: "", desc: "" })}
        aria-label="免許・資格の行を追加"
      >
        ＋ 免許・資格を追加
      </button>
    </fieldset>
  );
}
