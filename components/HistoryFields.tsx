"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";

export function HistoryFields() {
  const { control, register, formState: { errors } } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "history" });

  return (
    <fieldset>
      <legend>学歴・職歴</legend>
      <div id="history-container">
        {fields.map((field, index) => {
          const historyError = errors.history?.[index];

          return (
            <div key={field.id} className="array-item">
              <div className="form-grid form-grid-md-4">
                <div>
                  <label htmlFor={`history-${index}-year`}>年</label>
                  <input
                    id={`history-${index}-year`}
                    placeholder="年"
                    inputMode="numeric"
                    aria-invalid={Boolean(historyError?.year)}
                    aria-describedby={historyError?.year ? `history-${index}-year-error` : undefined}
                    {...register(`history.${index}.year` as const)}
                  />
                  {historyError?.year?.message && (
                    <p id={`history-${index}-year-error`} role="alert" aria-live="polite" className="text-error">
                      {historyError.year?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`history-${index}-month`}>月</label>
                  <input
                    id={`history-${index}-month`}
                    placeholder="月"
                    inputMode="numeric"
                    aria-invalid={Boolean(historyError?.month)}
                    aria-describedby={historyError?.month ? `history-${index}-month-error` : undefined}
                    {...register(`history.${index}.month` as const)}
                  />
                  {historyError?.month?.message && (
                    <p id={`history-${index}-month-error`} role="alert" aria-live="polite" className="text-error">
                      {historyError.month?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`history-${index}-desc`}>学歴・職歴</label>
                  <input
                    id={`history-${index}-desc`}
                    placeholder="学歴・職歴"
                    aria-invalid={Boolean(historyError?.desc)}
                    aria-describedby={historyError?.desc ? `history-${index}-desc-error` : undefined}
                    {...register(`history.${index}.desc` as const)}
                  />
                  {historyError?.desc?.message && (
                    <p id={`history-${index}-desc-error`} role="alert" aria-live="polite" className="text-error">
                      {historyError.desc?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`history-${index}-status`}>ステータス</label>
                  <select id={`history-${index}-status`} {...register(`history.${index}.status` as const)}>
                    <option value="入学">入学</option>
                    <option value="卒業">卒業</option>
                    <option value="中途退学">中途退学</option>
                    <option value="入社">入社</option>
                    <option value="退社">退社</option>
                    <option value="開業">開業</option>
                    <option value="閉業">閉業</option>
                  </select>
                </div>
              </div>
              <div className="array-item-actions">
                <button
                  type="button"
                  className="remove-btn touch-target array-remove-btn"
                  onClick={() => remove(index)}
                  aria-label="学歴・職歴の行を削除"
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
        id="add-history-btn"
        className="add-btn secondary-btn touch-target array-add-btn"
        onClick={() => append({ year: "", month: "", desc: "", status: "入社" })}
        aria-label="学歴・職歴の行を追加"
      >
        ＋ 学歴・職歴を追加
      </button>
    </fieldset>
  );
}
