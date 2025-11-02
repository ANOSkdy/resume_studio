'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SelfPrAnswersSchema, type SelfPrAnswersInput } from '@/lib/zod/selfpr';

const LS_KEY = '__selfpr_draft';

type FieldName = keyof SelfPrAnswersInput;

type Props = {
  initial?: Partial<SelfPrAnswersInput>;
};

const loadDraft = (): Partial<SelfPrAnswersInput> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    const result = SelfPrAnswersSchema.partial().safeParse(parsed);
    return result.success ? result.data : {};
  } catch (error) {
    console.warn('Failed to load self PR draft', error);
    return {};
  }
};

const FieldErrorText = ({ fieldId, message }: { fieldId: string; message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <p id={`${fieldId}-error`} role="alert" className="selfpr-error">
      {message}
    </p>
  );
};

const getErrorMessage = (errors: Record<string, unknown>, name: FieldName) => {
  const error = errors[name];
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message?: string }).message;
  }

  return undefined;
};

export default function SelfPrQuestionsForm({ initial }: Props) {
  const router = useRouter();
  const saveTimeoutRef = useRef<number | undefined>();

  const defaultValues = useMemo(() => initial ?? {}, [initial]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SelfPrAnswersInput>({
    resolver: zodResolver(SelfPrAnswersSchema),
    defaultValues: defaultValues as Partial<SelfPrAnswersInput>,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      reset({ ...defaultValues, ...draft });
      return;
    }

    if (Object.keys(defaultValues).length > 0) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const scheduleSave = useCallback((value: Partial<SelfPrAnswersInput>) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (saveTimeoutRef.current !== undefined) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        const hasContent = Object.values(value ?? {}).some((entry) => {
          if (typeof entry === 'string') {
            return entry.trim().length > 0;
          }
          return entry !== undefined && entry !== null;
        });

        if (!hasContent) {
          window.localStorage.removeItem(LS_KEY);
          return;
        }

        window.localStorage.setItem(LS_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn('Failed to save self PR draft', error);
      }
    }, 600);
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      scheduleSave(value as Partial<SelfPrAnswersInput>);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current !== undefined) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [scheduleSave, watch]);

  const onSubmit = handleSubmit((data) => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist self PR draft before navigation', error);
    }
    router.push('/cv/new?prefill=selfpr');
  });

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LS_KEY);
    }
    reset({} as Partial<SelfPrAnswersInput>);
  };

  const errorMessage = (name: FieldName) => getErrorMessage(errors as Record<string, unknown>, name);

  return (
    <form onSubmit={onSubmit} className="selfpr-form" noValidate>
      <section aria-labelledby="selfpr-q1" className="selfpr-section">
        <h2 id="selfpr-q1">1) 成果エピソード（STAR）</h2>
        <div>
          <label htmlFor="achievementTitle" className="selfpr-label">
            出来事のタイトル
          </label>
          <input
            id="achievementTitle"
            type="text"
            className="selfpr-input"
            aria-invalid={errorMessage('achievementTitle') ? 'true' : undefined}
            aria-describedby={errorMessage('achievementTitle') ? 'achievementTitle-error' : undefined}
            {...register('achievementTitle')}
          />
          <FieldErrorText fieldId="achievementTitle" message={errorMessage('achievementTitle')} />
        </div>
        <div className="selfpr-grid two">
          <div>
            <label htmlFor="situation" className="selfpr-label">
              状況 (S)
            </label>
            <textarea
              id="situation"
              rows={4}
              className="selfpr-textarea"
              aria-invalid={errorMessage('situation') ? 'true' : undefined}
              aria-describedby={errorMessage('situation') ? 'situation-error' : undefined}
              {...register('situation')}
            />
            <FieldErrorText fieldId="situation" message={errorMessage('situation')} />
          </div>
          <div>
            <label htmlFor="task" className="selfpr-label">
              課題 (T)
            </label>
            <textarea
              id="task"
              rows={4}
              className="selfpr-textarea"
              aria-invalid={errorMessage('task') ? 'true' : undefined}
              aria-describedby={errorMessage('task') ? 'task-error' : undefined}
              {...register('task')}
            />
            <FieldErrorText fieldId="task" message={errorMessage('task')} />
          </div>
          <div>
            <label htmlFor="action" className="selfpr-label">
              行動 (A)
            </label>
            <textarea
              id="action"
              rows={4}
              className="selfpr-textarea"
              aria-invalid={errorMessage('action') ? 'true' : undefined}
              aria-describedby={errorMessage('action') ? 'action-error' : undefined}
              {...register('action')}
            />
            <FieldErrorText fieldId="action" message={errorMessage('action')} />
          </div>
          <div>
            <label htmlFor="result" className="selfpr-label">
              結果 (R)
            </label>
            <textarea
              id="result"
              rows={4}
              className="selfpr-textarea"
              aria-invalid={errorMessage('result') ? 'true' : undefined}
              aria-describedby={errorMessage('result') ? 'result-error' : undefined}
              {...register('result')}
            />
            <FieldErrorText fieldId="result" message={errorMessage('result')} />
          </div>
        </div>
        <div>
          <label htmlFor="metrics" className="selfpr-label">
            数値・指標（任意）
          </label>
          <input
            id="metrics"
            type="text"
            placeholder="例: CVR +12pt / リード獲得数 +30%"
            className="selfpr-input"
            aria-invalid={errorMessage('metrics') ? 'true' : undefined}
            aria-describedby={errorMessage('metrics') ? 'metrics-error' : undefined}
            {...register('metrics')}
          />
          <FieldErrorText fieldId="metrics" message={errorMessage('metrics')} />
        </div>
      </section>

      <section aria-labelledby="selfpr-q2" className="selfpr-section">
        <h2 id="selfpr-q2">2) 強みTop3と裏付け</h2>
        {[1, 2, 3].map((index) => {
          const strengthKey = `strength${index}` as FieldName;
          const exampleKey = `example${index}` as FieldName;
          return (
            <div key={index} className="selfpr-grid two">
              <div>
                <label htmlFor={strengthKey} className="selfpr-label">
                  強み {index}
                </label>
                <input
                  id={strengthKey}
                  type="text"
                  className="selfpr-input"
                  aria-invalid={errorMessage(strengthKey) ? 'true' : undefined}
                  aria-describedby={errorMessage(strengthKey) ? `${strengthKey}-error` : undefined}
                  {...register(strengthKey)}
                />
                <FieldErrorText fieldId={strengthKey} message={errorMessage(strengthKey)} />
              </div>
              <div>
                <label htmlFor={exampleKey} className="selfpr-label">
                  行動例 {index}
                </label>
                <textarea
                  id={exampleKey}
                  rows={3}
                  className="selfpr-textarea"
                  aria-invalid={errorMessage(exampleKey) ? 'true' : undefined}
                  aria-describedby={errorMessage(exampleKey) ? `${exampleKey}-error` : undefined}
                  {...register(exampleKey)}
                />
                <FieldErrorText fieldId={exampleKey} message={errorMessage(exampleKey)} />
              </div>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="selfpr-q3" className="selfpr-section">
        <h2 id="selfpr-q3">3) 発揮できる環境／避けたい条件</h2>
        <div>
          <label htmlFor="bestFit" className="selfpr-label">
            最適な環境・役割・相手
          </label>
          <textarea
            id="bestFit"
            rows={4}
            className="selfpr-textarea"
            aria-invalid={errorMessage('bestFit') ? 'true' : undefined}
            aria-describedby={errorMessage('bestFit') ? 'bestFit-error' : undefined}
            {...register('bestFit')}
          />
          <FieldErrorText fieldId="bestFit" message={errorMessage('bestFit')} />
        </div>
        <div>
          <label htmlFor="avoid" className="selfpr-label">
            避けたい条件（任意）
          </label>
          <input
            id="avoid"
            type="text"
            className="selfpr-input"
            aria-invalid={errorMessage('avoid') ? 'true' : undefined}
            aria-describedby={errorMessage('avoid') ? 'avoid-error' : undefined}
            {...register('avoid')}
          />
          <FieldErrorText fieldId="avoid" message={errorMessage('avoid')} />
        </div>
      </section>

      <section aria-labelledby="selfpr-q4" className="selfpr-section">
        <h2 id="selfpr-q4">4) 行動原則（1〜3）</h2>
        {[1, 2, 3].map((index) => {
          const principleKey = `principle${index}` as FieldName;
          return (
            <div key={index}>
              <label htmlFor={principleKey} className="selfpr-label">
                原則 {index}（任意）
              </label>
              <input
                id={principleKey}
                type="text"
                className="selfpr-input"
                aria-invalid={errorMessage(principleKey) ? 'true' : undefined}
                aria-describedby={errorMessage(principleKey) ? `${principleKey}-error` : undefined}
                {...register(principleKey)}
              />
              <FieldErrorText fieldId={principleKey} message={errorMessage(principleKey)} />
            </div>
          );
        })}
      </section>

      <section aria-labelledby="selfpr-q5" className="selfpr-section">
        <h2 id="selfpr-q5">5) 今後1年の提供価値</h2>
        <div className="selfpr-grid three">
          <div>
            <label htmlFor="futureTarget" className="selfpr-label">
              誰に
            </label>
            <input
              id="futureTarget"
              type="text"
              className="selfpr-input"
              aria-invalid={errorMessage('futureTarget') ? 'true' : undefined}
              aria-describedby={errorMessage('futureTarget') ? 'futureTarget-error' : undefined}
              {...register('futureTarget')}
            />
            <FieldErrorText fieldId="futureTarget" message={errorMessage('futureTarget')} />
          </div>
          <div>
            <label htmlFor="futureValue" className="selfpr-label">
              何を
            </label>
            <input
              id="futureValue"
              type="text"
              className="selfpr-input"
              aria-invalid={errorMessage('futureValue') ? 'true' : undefined}
              aria-describedby={errorMessage('futureValue') ? 'futureValue-error' : undefined}
              {...register('futureValue')}
            />
            <FieldErrorText fieldId="futureValue" message={errorMessage('futureValue')} />
          </div>
          <div>
            <label htmlFor="futureLevel" className="selfpr-label">
              どの水準で（指標）
            </label>
            <input
              id="futureLevel"
              type="text"
              placeholder="例: 月次売上 +15% / NPS 60"
              className="selfpr-input"
              aria-invalid={errorMessage('futureLevel') ? 'true' : undefined}
              aria-describedby={errorMessage('futureLevel') ? 'futureLevel-error' : undefined}
              {...register('futureLevel')}
            />
            <FieldErrorText fieldId="futureLevel" message={errorMessage('futureLevel')} />
          </div>
        </div>
        <div>
          <label htmlFor="futureProof" className="selfpr-label">
            学習・実践（証拠・任意）
          </label>
          <textarea
            id="futureProof"
            rows={3}
            className="selfpr-textarea"
            aria-invalid={errorMessage('futureProof') ? 'true' : undefined}
            aria-describedby={errorMessage('futureProof') ? 'futureProof-error' : undefined}
            {...register('futureProof')}
          />
          <FieldErrorText fieldId="futureProof" message={errorMessage('futureProof')} />
        </div>
      </section>

      <div className="selfpr-actions">
        <button type="submit" className="selfpr-button primary" disabled={isSubmitting}>
          保存して次へ
        </button>
        <button type="button" className="selfpr-button" onClick={handleClear}>
          下書きクリア
        </button>
      </div>

      <style jsx>{`
        .selfpr-form {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 16px 48px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .selfpr-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 20px;
          border: 1px solid rgba(17, 17, 17, 0.06);
          padding: 20px 18px;
          box-shadow: var(--shadow-soft);
        }

        .selfpr-section h2 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .selfpr-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
        }

        .selfpr-input,
        .selfpr-textarea {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #d1d5db;
          padding: 10px 14px;
          font-size: 0.95rem;
          background-color: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .selfpr-input:focus,
        .selfpr-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.18);
        }

        .selfpr-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .selfpr-input[aria-invalid='true'],
        .selfpr-textarea[aria-invalid='true'] {
          border-color: #dc2626;
        }

        .selfpr-error {
          margin-top: 4px;
          font-size: 0.8rem;
          color: #dc2626;
        }

        .selfpr-grid {
          display: grid;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .selfpr-grid.two {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .selfpr-grid.three {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .selfpr-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: flex-start;
        }

        .selfpr-button {
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #fff;
          padding: 10px 22px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
        }

        .selfpr-button:hover {
          background-color: rgba(17, 24, 39, 0.05);
        }

        .selfpr-button.primary {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #fff;
        }

        .selfpr-button.primary:hover {
          filter: brightness(0.96);
        }

        .selfpr-button:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .selfpr-form {
            padding: 32px 0 56px;
          }
        }
      `}</style>
    </form>
  );
}
