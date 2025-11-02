import { createSimplePdf, type TextBlock } from '../shared/simplePdf';

type NullableString = string | null | undefined;

type ContactRecord = Record<string, unknown> | undefined;

type JobRecord = {
  company?: NullableString;
  role?: NullableString;
  start?: NullableString;
  end?: NullableString;
  description?: NullableString;
};

type EducationRecord = {
  school?: NullableString;
  degree?: NullableString;
  graduation?: NullableString;
  description?: NullableString;
};

type ResumeBasicInput = {
  name?: NullableString;
  headline?: NullableString;
  summary?: NullableString;
  contacts?: ContactRecord;
  jobs?: JobRecord[] | undefined;
  education?: EducationRecord[] | undefined;
  skills?: NullableString[] | undefined;
  __meta?: {
    generatedAt?: string;
  };
};

const LINE_FONT = 12;
const SECTION_TITLE_FONT = 16;

function appendText(blocks: TextBlock[], text: NullableString, fontSize: number) {
  if (!text) return;
  const lines = `${text}`.split(/\r?\n/).filter((line) => line.trim().length > 0);
  for (const line of lines) {
    blocks.push({ text: line, fontSize });
  }
}

export async function render(payload: unknown = {}): Promise<Uint8Array> {
  const data =
    payload && typeof payload === 'object'
      ? (payload as ResumeBasicInput)
      : ({} as ResumeBasicInput);

  const blocks: TextBlock[] = [];
  const name = data.name?.toString().trim() || '応募者';
  const headline = data.headline?.toString().trim();

  blocks.push({ text: name, fontSize: 28 });

  if (headline) {
    blocks.push({ text: headline, fontSize: 18 });
  }

  appendText(blocks, data.summary, LINE_FONT);

  if (data.contacts && typeof data.contacts === 'object') {
    blocks.push({ text: '連絡先', fontSize: SECTION_TITLE_FONT });
    for (const [key, value] of Object.entries(data.contacts)) {
      if (value === undefined || value === null) continue;
      blocks.push({ text: `${key}: ${value}`, fontSize: LINE_FONT });
    }
  }

  if (Array.isArray(data.jobs) && data.jobs.length > 0) {
    blocks.push({ text: '職務経歴', fontSize: SECTION_TITLE_FONT });
    for (const job of data.jobs) {
      const company = job.company?.toString().trim();
      const role = job.role?.toString().trim();
      const term = [job.start, job.end].filter(Boolean).join(' - ');
      if (company || role || term) {
        blocks.push({
          text: [company, role, term].filter(Boolean).join(' | '),
          fontSize: LINE_FONT,
        });
      }
      appendText(blocks, job.description, LINE_FONT);
    }
  }

  if (Array.isArray(data.education) && data.education.length > 0) {
    blocks.push({ text: '学歴', fontSize: SECTION_TITLE_FONT });
    for (const edu of data.education) {
      const school = edu.school?.toString().trim();
      const degree = edu.degree?.toString().trim();
      const grad = edu.graduation?.toString().trim();
      if (school || degree || grad) {
        blocks.push({
          text: [school, degree, grad].filter(Boolean).join(' | '),
          fontSize: LINE_FONT,
        });
      }
      appendText(blocks, edu.description, LINE_FONT);
    }
  }

  if (Array.isArray(data.skills) && data.skills.length > 0) {
    blocks.push({ text: 'スキル', fontSize: SECTION_TITLE_FONT });
    blocks.push({ text: data.skills.filter(Boolean).join(', '), fontSize: LINE_FONT });
  }

  const generatedAt = data.__meta?.generatedAt;
  if (generatedAt) {
    blocks.push({ text: ' ', fontSize: LINE_FONT });
    blocks.push({ text: `生成日時: ${generatedAt}`, fontSize: 10 });
  }

  return createSimplePdf(blocks);
}
