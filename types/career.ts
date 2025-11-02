export type CareerAnswers = {
  // Q1 要約
  summary: string; // 3-5行
  // Q2 基本情報
  companyName: string;
  department?: string;
  roleTitle: string;
  employmentType: 'permanent' | 'contract' | 'parttime' | 'intern';
  startYm: string; // YYYY-MM
  endYm?: string; // YYYY-MM or undefined (=在籍中)
  isCurrent?: boolean;
  industry?: string;
  teamSize?: number;
  directReports?: number;
  // Q3 責務/技術/成果物
  responsibilities: string; // 改行区切り 3-6行
  toolsAndSkills: string; // カンマ区切り <=10
  deliverables?: string; // 改行区切り <=3
  // Q4 成果(最大3)
  ach1_title?: string;
  ach1_goal?: string;
  ach1_actions?: string;
  ach1_result?: string;
  ach1_metrics?: string;
  ach1_role?: 'IC' | 'Lead' | 'Mgr';
  ach2_title?: string;
  ach2_goal?: string;
  ach2_actions?: string;
  ach2_result?: string;
  ach2_metrics?: string;
  ach2_role?: 'IC' | 'Lead' | 'Mgr';
  ach3_title?: string;
  ach3_goal?: string;
  ach3_actions?: string;
  ach3_result?: string;
  ach3_metrics?: string;
  ach3_role?: 'IC' | 'Lead' | 'Mgr';
  // Q5 志向
  targetRoles?: string;
  targetIndustries?: string;
  workStyle?: 'onsite' | 'hybrid' | 'remote';
  valueTarget?: string; // 誰に
  valueWhat?: string; // 何を
  valueLevel?: string; // どの水準で
  proof?: string; // 証跡 1-3
};
