"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";

export function HistoryFields() {
  const { control, register } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "history" });

  return (
    <fieldset>
      <legend>学歴・職歴</legend>
      <div id="history-container">
        {fields.map((field, index) => (
          <div key={field.id} className="entry-group history-group">
            <input placeholder="年" {...register(`history.${index}.year`)} className="history-year" />
            <input placeholder="月" {...register(`history.${index}.month`)} className="history-month" />
            <input placeholder="学歴・職歴" {...register(`history.${index}.desc`)} className="history-desc" />
            <select {...register(`history.${index}.status`)} className="history-status">
              <option value="入学">入学</option>
              <option value="卒業">卒業</option>
              <option value="中途退学">中途退学</option>
              <option value="入社">入社</option>
              <option value="退社">退社</option>
              <option value="開業">開業</option>
              <option value="閉業">閉業</option>
            </select>
            <button type="button" className="remove-btn" onClick={() => remove(index)}>削除</button>
          </div>
        ))}
      </div>
      <button
        type="button"
        id="add-history-btn"
        className="add-btn secondary-btn"
        onClick={() => append({ year: "", month: "", desc: "", status: "入社" })}
      >
        ＋ 学歴・職歴を追加
      </button>
    </fieldset>
  );
}
