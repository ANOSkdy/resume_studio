import { z } from 'zod';

export const SelfPrAnswersSchema = z.object({
  achievementTitle: z
    .string()
    .trim()
    .min(3, { message: '3文字以上で入力してください。' })
    .max(80, { message: '80文字以内で入力してください。' }),
  situation: z
    .string()
    .trim()
    .min(10, { message: '状況(S)を10文字以上で入力してください。' })
    .max(600, { message: '状況(S)は600文字以内で入力してください。' }),
  task: z
    .string()
    .trim()
    .min(10, { message: '課題(T)を10文字以上で入力してください。' })
    .max(400, { message: '課題(T)は400文字以内で入力してください。' }),
  action: z
    .string()
    .trim()
    .min(10, { message: '行動(A)を10文字以上で入力してください。' })
    .max(600, { message: '行動(A)は600文字以内で入力してください。' }),
  result: z
    .string()
    .trim()
    .min(5, { message: '結果(R)を5文字以上で入力してください。' })
    .max(400, { message: '結果(R)は400文字以内で入力してください。' }),
  metrics: z
    .string()
    .trim()
    .max(200, { message: '数値・指標は200文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  strength1: z
    .string()
    .trim()
    .min(2, { message: '強み1は2文字以上で入力してください。' })
    .max(30, { message: '強み1は30文字以内で入力してください。' }),
  example1: z
    .string()
    .trim()
    .min(5, { message: '強み1の行動例は5文字以上で入力してください。' })
    .max(300, { message: '強み1の行動例は300文字以内で入力してください。' }),
  strength2: z
    .string()
    .trim()
    .min(2, { message: '強み2は2文字以上で入力してください。' })
    .max(30, { message: '強み2は30文字以内で入力してください。' }),
  example2: z
    .string()
    .trim()
    .min(5, { message: '強み2の行動例は5文字以上で入力してください。' })
    .max(300, { message: '強み2の行動例は300文字以内で入力してください。' }),
  strength3: z
    .string()
    .trim()
    .min(2, { message: '強み3は2文字以上で入力してください。' })
    .max(30, { message: '強み3は30文字以内で入力してください。' }),
  example3: z
    .string()
    .trim()
    .min(5, { message: '強み3の行動例は5文字以上で入力してください。' })
    .max(300, { message: '強み3の行動例は300文字以内で入力してください。' }),
  bestFit: z
    .string()
    .trim()
    .min(5, { message: '発揮できる環境を5文字以上で入力してください。' })
    .max(300, { message: '発揮できる環境は300文字以内で入力してください。' }),
  avoid: z
    .string()
    .trim()
    .max(200, { message: '避けたい条件は200文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  principle1: z
    .string()
    .trim()
    .max(80, { message: '行動原則1は80文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  principle2: z
    .string()
    .trim()
    .max(80, { message: '行動原則2は80文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  principle3: z
    .string()
    .trim()
    .max(80, { message: '行動原則3は80文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  futureTarget: z
    .string()
    .trim()
    .min(2, { message: '「誰に」は2文字以上で入力してください。' })
    .max(80, { message: '「誰に」は80文字以内で入力してください。' }),
  futureValue: z
    .string()
    .trim()
    .min(2, { message: '「何を」は2文字以上で入力してください。' })
    .max(120, { message: '「何を」は120文字以内で入力してください。' }),
  futureLevel: z
    .string()
    .trim()
    .min(2, { message: '「どの水準で」は2文字以上で入力してください。' })
    .max(120, { message: '「どの水準で」は120文字以内で入力してください。' }),
  futureProof: z
    .string()
    .trim()
    .max(400, { message: '学習・実践は400文字以内で入力してください。' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type SelfPrAnswersInput = z.infer<typeof SelfPrAnswersSchema>;
