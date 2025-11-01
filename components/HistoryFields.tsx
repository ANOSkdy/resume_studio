"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { IResumeFormData } from "@/types";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function HistoryFields() {
  const { control, register } = useFormContext<IResumeFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "history" });

  return (
    <fieldset>
      <legend>学歴・職歴</legend>
      <div id="history-container">
        {fields.map((field, index) => {
          const base = `history.${index}`;
          return (
            <div key={field.id} className="entry-group history-group">
              <Field label="年" htmlFor={`history-year-${index}`}>
                <Input id={`history-year-${index}`} placeholder="年" {...register(`${base}.year`)} />
              </Field>
              <Field label="月" htmlFor={`history-month-${index}`}>
                <Input id={`history-month-${index}`} placeholder="月" {...register(`${base}.month`)} />
              </Field>
              <Field label="学歴・職歴" htmlFor={`history-desc-${index}`}>
                <Input id={`history-desc-${index}`} placeholder="内容" {...register(`${base}.desc`)} />
              </Field>
              <Field label="区分" htmlFor={`history-status-${index}`}>
                <Select id={`history-status-${index}`} {...register(`${base}.status`)}>
                  <option value="入学">入学</option>
                  <option value="卒業">卒業</option>
                  <option value="中途退学">中途退学</option>
                  <option value="入社">入社</option>
                  <option value="退社">退社</option>
                  <option value="開業">開業</option>
                  <option value="閉業">閉業</option>
                </Select>
              </Field>
              <Button type="button" variant="ghost" aria-label="この行を削除" onClick={() => remove(index)}>削除</Button>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="secondary"
        id="add-history-btn"
        onClick={() => append({ year: "", month: "", desc: "", status: "入社" })}
      >
        ＋ 学歴・職歴を追加
      </Button>
    </fieldset>
  );
}
