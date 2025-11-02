import { z } from 'zod';

const ym = z.string().regex(/^[0-9]{4}-[0-9]{2}$/, 'YYYY-MM 形式で入力してください');

export const CareerAnswersSchema = z.object({
  summary: z.string().min(30, '30文字以上で入力してください').max(600, '600文字以内で入力してください'),
  companyName: z.string().min(2, '2文字以上で入力してください').max(120, '120文字以内で入力してください'),
  department: z.string().max(120, '120文字以内で入力してください').optional(),
  roleTitle: z.string().min(2, '2文字以上で入力してください').max(120, '120文字以内で入力してください'),
  employmentType: z.enum(['permanent', 'contract', 'parttime', 'intern']),
  startYm: ym,
  endYm: ym.optional(),
  isCurrent: z.boolean().optional(),
  industry: z.string().max(120, '120文字以内で入力してください').optional(),
  teamSize: z
    .coerce.number({ invalid_type_error: '数値で入力してください' })
    .int('整数で入力してください')
    .min(0, '0以上の数値で入力してください')
    .max(5000, '5000以下で入力してください')
    .optional(),
  directReports: z
    .coerce.number({ invalid_type_error: '数値で入力してください' })
    .int('整数で入力してください')
    .min(0, '0以上の数値で入力してください')
    .max(500, '500以下で入力してください')
    .optional(),
  responsibilities: z.string().min(20, '20文字以上で入力してください').max(800, '800文字以内で入力してください'),
  toolsAndSkills: z.string().min(2, '2文字以上で入力してください').max(300, '300文字以内で入力してください'),
  deliverables: z.string().max(300, '300文字以内で入力してください').optional(),
  ach1_title: z.string().max(80, '80文字以内で入力してください').optional(),
  ach1_goal: z.string().max(300, '300文字以内で入力してください').optional(),
  ach1_actions: z.string().max(500, '500文字以内で入力してください').optional(),
  ach1_result: z.string().max(300, '300文字以内で入力してください').optional(),
  ach1_metrics: z.string().max(160, '160文字以内で入力してください').optional(),
  ach1_role: z.enum(['IC', 'Lead', 'Mgr']).optional(),
  ach2_title: z.string().max(80, '80文字以内で入力してください').optional(),
  ach2_goal: z.string().max(300, '300文字以内で入力してください').optional(),
  ach2_actions: z.string().max(500, '500文字以内で入力してください').optional(),
  ach2_result: z.string().max(300, '300文字以内で入力してください').optional(),
  ach2_metrics: z.string().max(160, '160文字以内で入力してください').optional(),
  ach2_role: z.enum(['IC', 'Lead', 'Mgr']).optional(),
  ach3_title: z.string().max(80, '80文字以内で入力してください').optional(),
  ach3_goal: z.string().max(300, '300文字以内で入力してください').optional(),
  ach3_actions: z.string().max(500, '500文字以内で入力してください').optional(),
  ach3_result: z.string().max(300, '300文字以内で入力してください').optional(),
  ach3_metrics: z.string().max(160, '160文字以内で入力してください').optional(),
  ach3_role: z.enum(['IC', 'Lead', 'Mgr']).optional(),
  targetRoles: z.string().max(200, '200文字以内で入力してください').optional(),
  targetIndustries: z.string().max(200, '200文字以内で入力してください').optional(),
  workStyle: z.enum(['onsite', 'hybrid', 'remote']).optional(),
  valueTarget: z.string().max(120, '120文字以内で入力してください').optional(),
  valueWhat: z.string().max(160, '160文字以内で入力してください').optional(),
  valueLevel: z.string().max(160, '160文字以内で入力してください').optional(),
  proof: z.string().max(400, '400文字以内で入力してください').optional(),
});

export type CareerAnswersInput = z.infer<typeof CareerAnswersSchema>;
