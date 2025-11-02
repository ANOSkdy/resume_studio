import type { CareerAnswers } from '@/types/career';

function toLines(source?: string) {
  return (source ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toList(source?: string) {
  return (source ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export function buildCareerPrompt(answers: CareerAnswers) {
  const responsibilities = toLines(answers.responsibilities);
  const tools = toList(answers.toolsAndSkills);
  const deliverables = toLines(answers.deliverables).slice(0, 3);

  const achievements = [1, 2, 3]
    .map((index) => ({
      title: (answers as Record<string, unknown>)[`ach${index}_title`] ?? '',
      goal: (answers as Record<string, unknown>)[`ach${index}_goal`] ?? '',
      actions: (answers as Record<string, unknown>)[`ach${index}_actions`] ?? '',
      result: (answers as Record<string, unknown>)[`ach${index}_result`] ?? '',
      metrics: (answers as Record<string, unknown>)[`ach${index}_metrics`] ?? '',
      role: (answers as Record<string, unknown>)[`ach${index}_role`] ?? '',
    }))
    .filter((item) => Object.values(item).some((value) => typeof value === 'string' && value.trim().length > 0));

  const payload = {
    summary: answers.summary,
    position: {
      companyName: answers.companyName,
      department: answers.department,
      roleTitle: answers.roleTitle,
      employmentType: answers.employmentType,
      period: {
        startYm: answers.startYm,
        endYm: answers.endYm,
        isCurrent: Boolean(answers.isCurrent),
      },
      industry: answers.industry,
      teamSize: answers.teamSize,
      directReports: answers.directReports,
      responsibilities,
      tools,
      deliverables,
    },
    achievements,
    intent: {
      targetRoles: answers.targetRoles,
      targetIndustries: answers.targetIndustries,
      workStyle: answers.workStyle,
      value: {
        target: answers.valueTarget,
        what: answers.valueWhat,
        level: answers.valueLevel,
        proof: answers.proof,
      },
    },
  };

  const system = [
    'あなたは日本の人事・採用文脈に最適化された職務経歴書ライターです。',
    '箇条書きは・で統一し、冗長表現を避け、事実と数値に基づき簡潔に記述します。',
    '応募先に合わせて要約→職務概要→責務→成果→スキルの順で構成し、語尾や表記ゆれを統一します。',
  ].join('\n');

  const user = [
    '# 入力データ（構造化）',
    '```json',
    JSON.stringify(payload, null, 2),
    '```',
    '',
    '# 出力要件',
    '- 日本語、A4想定、読み手が一次スクリーニングで判断しやすい密度で記述',
    '- 最初に3〜5行の職務要約、その後に直近ポジションの職務概要、主要責務、成果(最大3)、スキルまとめ',
    '- 成果は「目標→行動→結果→数値」で簡潔に、役割(IC/Lead/Mgr)を明記',
  ].join('\n');

  return { system, user, payload };
}
