'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { CareerAnswersSchema, type CareerAnswersInput } from '@/lib/zod/career';

const LS_KEY = '__career_draft';
const SAVE_DELAY = 800;

const ACHIEVEMENT_FIELD_SETS = [
  {
    index: 1,
    keys: {
      title: 'ach1_title',
      goal: 'ach1_goal',
      actions: 'ach1_actions',
      result: 'ach1_result',
      metrics: 'ach1_metrics',
      role: 'ach1_role',
    },
  },
  {
    index: 2,
    keys: {
      title: 'ach2_title',
      goal: 'ach2_goal',
      actions: 'ach2_actions',
      result: 'ach2_result',
      metrics: 'ach2_metrics',
      role: 'ach2_role',
    },
  },
  {
    index: 3,
    keys: {
      title: 'ach3_title',
      goal: 'ach3_goal',
      actions: 'ach3_actions',
      result: 'ach3_result',
      metrics: 'ach3_metrics',
      role: 'ach3_role',
    },
  },
] as const satisfies ReadonlyArray<{
  index: number;
  keys: {
    title: keyof CareerAnswersInput;
    goal: keyof CareerAnswersInput;
    actions: keyof CareerAnswersInput;
    result: keyof CareerAnswersInput;
    metrics: keyof CareerAnswersInput;
    role: keyof CareerAnswersInput;
  };
}>;

export default function CareerQuestionsForm({ initial }: { initial?: Partial<CareerAnswersInput> }) {
  const router = useRouter();

  const defaults = useMemo<Partial<CareerAnswersInput>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        return { ...(initial || {}), ...saved } as Partial<CareerAnswersInput>;
      } catch (error) {
        console.warn('Failed to parse career draft', error);
      }
    }
    return initial || {};
  }, [initial]);

  const { register, handleSubmit, formState, watch, reset } = useForm<CareerAnswersInput>({
    resolver: zodResolver(CareerAnswersSchema),
    defaultValues: defaults,
    mode: 'onChange',
  });

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const subscription = watch((value) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(value));
        } catch (error) {
          console.warn('Failed to persist career draft', error);
        }
      }, SAVE_DELAY);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [watch]);

  const onSubmit = (data: CareerAnswersInput) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist career draft', error);
    }
    router.push('/cv/new?prefill=career');
  };

  const onClear = () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch (error) {
      console.warn('Failed to clear career draft', error);
    }
    reset({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6">
      {/* Q1 */}
      <section aria-labelledby="q1" className="space-y-3">
        <h2 id="q1" className="text-lg font-semibold">
          1) 職務要約（3〜5行）
        </h2>
        <p className="text-sm text-gray-600">経験年数・担当領域・規模感・強みを含めた要約を書いてください。</p>
        <textarea
          id="summary"
          rows={4}
          className="mt-1 w-full rounded border border-gray-300 p-2"
          aria-invalid={formState.errors.summary ? 'true' : 'false'}
          {...register('summary')}
          placeholder="経験年数／担当領域／規模感／強み など"
        />
        {formState.errors.summary && (
          <p className="text-sm text-red-600" role="alert">
            {formState.errors.summary.message}
          </p>
        )}
      </section>

      {/* Q2 */}
      <section aria-labelledby="q2" className="space-y-3">
        <h2 id="q2" className="text-lg font-semibold">
          2) 直近ポジションの基本情報
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">
              会社名
            </label>
            <input
              id="companyName"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.companyName ? 'true' : 'false'}
              {...register('companyName')}
            />
            {formState.errors.companyName && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.companyName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium">
              部門（任意）
            </label>
            <input
              id="department"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.department ? 'true' : 'false'}
              {...register('department')}
            />
            {formState.errors.department && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.department.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="roleTitle" className="block text-sm font-medium">
              役職/ロール
            </label>
            <input
              id="roleTitle"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.roleTitle ? 'true' : 'false'}
              {...register('roleTitle')}
            />
            {formState.errors.roleTitle && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.roleTitle.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium">
              業界（任意）
            </label>
            <input
              id="industry"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.industry ? 'true' : 'false'}
              {...register('industry')}
            />
            {formState.errors.industry && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.industry.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium">
              雇用形態
            </label>
            <select
              id="employmentType"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.employmentType ? 'true' : 'false'}
              {...register('employmentType')}
            >
              <option value="permanent">正社員</option>
              <option value="contract">契約</option>
              <option value="parttime">パート</option>
              <option value="intern">インターン</option>
            </select>
            {formState.errors.employmentType && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.employmentType.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startYm" className="block text-sm font-medium">
                開始(YYYY-MM)
              </label>
              <input
                id="startYm"
                placeholder="2023-04"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                aria-invalid={formState.errors.startYm ? 'true' : 'false'}
                {...register('startYm')}
              />
              {formState.errors.startYm && (
                <p className="text-sm text-red-600" role="alert">
                  {formState.errors.startYm.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="endYm" className="block text-sm font-medium">
                終了(任意)
              </label>
              <input
                id="endYm"
                placeholder="2025-03"
                className="mt-1 w-full rounded border border-gray-300 p-2"
                aria-invalid={formState.errors.endYm ? 'true' : 'false'}
                {...register('endYm')}
              />
              {formState.errors.endYm && (
                <p className="text-sm text-red-600" role="alert">
                  {formState.errors.endYm.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium">
              チーム規模（任意）
            </label>
            <input
              id="teamSize"
              type="number"
              inputMode="numeric"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.teamSize ? 'true' : 'false'}
              {...register('teamSize', { valueAsNumber: true })}
            />
            {formState.errors.teamSize && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.teamSize.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="directReports" className="block text-sm font-medium">
              直属部下数（任意）
            </label>
            <input
              id="directReports"
              type="number"
              inputMode="numeric"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.directReports ? 'true' : 'false'}
              {...register('directReports', { valueAsNumber: true })}
            />
            {formState.errors.directReports && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.directReports.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Q3 */}
      <section aria-labelledby="q3" className="space-y-3">
        <h2 id="q3" className="text-lg font-semibold">
          3) 主要責務・技術・成果物
        </h2>
        <div>
          <label htmlFor="responsibilities" className="block text-sm font-medium">
            責務（3〜6行・改行区切り）
          </label>
          <textarea
            id="responsibilities"
            rows={4}
            className="mt-1 w-full rounded border border-gray-300 p-2"
            aria-invalid={formState.errors.responsibilities ? 'true' : 'false'}
            {...register('responsibilities')}
          />
          {formState.errors.responsibilities && (
            <p className="text-sm text-red-600" role="alert">
              {formState.errors.responsibilities.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="toolsAndSkills" className="block text-sm font-medium">
            使用スキル・ツール（カンマ区切り・10個以内）
          </label>
          <input
            id="toolsAndSkills"
            className="mt-1 w-full rounded border border-gray-300 p-2"
            aria-invalid={formState.errors.toolsAndSkills ? 'true' : 'false'}
            placeholder="Next.js, React, Airtable, ..."
            {...register('toolsAndSkills')}
          />
          {formState.errors.toolsAndSkills && (
            <p className="text-sm text-red-600" role="alert">
              {formState.errors.toolsAndSkills.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="deliverables" className="block text-sm font-medium">
            成果物（任意・改行区切り・3つまで）
          </label>
          <textarea
            id="deliverables"
            rows={3}
            className="mt-1 w-full rounded border border-gray-300 p-2"
            aria-invalid={formState.errors.deliverables ? 'true' : 'false'}
            {...register('deliverables')}
          />
          {formState.errors.deliverables && (
            <p className="text-sm text-red-600" role="alert">
              {formState.errors.deliverables.message}
            </p>
          )}
        </div>
      </section>

      {/* Q4 */}
      <section aria-labelledby="q4" className="space-y-3">
        <h2 id="q4" className="text-lg font-semibold">
          4) 成果エピソード（最大3件）
        </h2>
        {ACHIEVEMENT_FIELD_SETS.map(({ index, keys }) => (
          <fieldset key={index} className="space-y-2 rounded border border-gray-200 p-3">
            <legend className="text-sm font-medium">エピソード {index}</legend>
            <input
              className="w-full rounded border border-gray-300 p-2"
              placeholder="タイトル"
              {...register(keys.title)}
            />
            <textarea
              rows={2}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="目標/KPI"
              {...register(keys.goal)}
            />
            <textarea
              rows={3}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="行動（主要アクション）"
              {...register(keys.actions)}
            />
            <textarea
              rows={2}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="結果（事実）"
              {...register(keys.result)}
            />
            <input
              className="w-full rounded border border-gray-300 p-2"
              placeholder="数値指標（%/件/時間/金額など）"
              {...register(keys.metrics)}
            />
            <div>
              <label className="block text-sm font-medium" htmlFor={`ach${index}_role`}>
                役割
              </label>
              <select id={`ach${index}_role`} className="mt-1 w-full rounded border border-gray-300 p-2" {...register(keys.role)}>
                <option value="">未選択</option>
                <option value="IC">IC</option>
                <option value="Lead">Lead</option>
                <option value="Mgr">Mgr</option>
              </select>
            </div>
          </fieldset>
        ))}
      </section>

      {/* Q5 */}
      <section aria-labelledby="q5" className="space-y-3">
        <h2 id="q5" className="text-lg font-semibold">
          5) 志向と提供価値（1年）
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="targetRoles" className="block text-sm font-medium">
              希望職種（任意）
            </label>
            <input
              id="targetRoles"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.targetRoles ? 'true' : 'false'}
              {...register('targetRoles')}
            />
            {formState.errors.targetRoles && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.targetRoles.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="targetIndustries" className="block text-sm font-medium">
              希望業界（任意）
            </label>
            <input
              id="targetIndustries"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.targetIndustries ? 'true' : 'false'}
              {...register('targetIndustries')}
            />
            {formState.errors.targetIndustries && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.targetIndustries.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="workStyle" className="block text-sm font-medium">
              働き方（任意）
            </label>
            <select
              id="workStyle"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.workStyle ? 'true' : 'false'}
              {...register('workStyle')}
            >
              <option value="">未選択</option>
              <option value="onsite">オンサイト</option>
              <option value="hybrid">ハイブリッド</option>
              <option value="remote">リモート</option>
            </select>
            {formState.errors.workStyle && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.workStyle.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="valueTarget" className="block text-sm font-medium">
              提供価値：誰に
            </label>
            <input
              id="valueTarget"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.valueTarget ? 'true' : 'false'}
              {...register('valueTarget')}
            />
            {formState.errors.valueTarget && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.valueTarget.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="valueWhat" className="block text-sm font-medium">
              提供価値：何を
            </label>
            <input
              id="valueWhat"
              className="mt-1 w-full rounded border border-gray-300 p-2"
              aria-invalid={formState.errors.valueWhat ? 'true' : 'false'}
              {...register('valueWhat')}
            />
            {formState.errors.valueWhat && (
              <p className="text-sm text-red-600" role="alert">
                {formState.errors.valueWhat.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="valueLevel" className="block text-sm font-medium">
            提供価値：どの水準で
          </label>
          <input
            id="valueLevel"
            className="mt-1 w-full rounded border border-gray-300 p-2"
            aria-invalid={formState.errors.valueLevel ? 'true' : 'false'}
            placeholder="例：月次売上+15%／NPS 60"
            {...register('valueLevel')}
          />
          {formState.errors.valueLevel && (
            <p className="text-sm text-red-600" role="alert">
              {formState.errors.valueLevel.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="proof" className="block text-sm font-medium">
            根拠（学習・実務の証跡・任意）
          </label>
          <textarea
            id="proof"
            rows={2}
            className="mt-1 w-full rounded border border-gray-300 p-2"
            aria-invalid={formState.errors.proof ? 'true' : 'false'}
            {...register('proof')}
          />
          {formState.errors.proof && (
            <p className="text-sm text-red-600" role="alert">
              {formState.errors.proof.message}
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
        >
          保存して次へ
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          下書きクリア
        </button>
      </div>

      {Object.keys(formState.errors || {}).length > 0 && (
        <p className="text-sm text-red-600" role="alert">
          未入力・形式エラーを確認してください。
        </p>
      )}
    </form>
  );
}
