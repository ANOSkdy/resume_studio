import { createSimplePdf, type TextBlock } from '../shared/simplePdf';

type NullableString = string | null | undefined;

type CvRecord = {
  title?: NullableString;
  organization?: NullableString;
  location?: NullableString;
  start?: NullableString;
  end?: NullableString;
  description?: NullableString;
};

type CvBasicInput = {
  name?: NullableString;
  headline?: NullableString;
  profile?: NullableString;
  qualifications?: NullableString[] | undefined;
  experience?: CvRecord[] | undefined;
  education?: CvRecord[] | undefined;
  publications?: CvRecord[] | undefined;
  __meta?: {
    generatedAt?: string;
  };
};

const BODY_FONT = 12;
const SECTION_FONT = 16;

function appendRecord(blocks: TextBlock[], heading: string, records?: CvRecord[]) {
  if (!Array.isArray(records) || records.length === 0) return;
  blocks.push({ text: heading, fontSize: SECTION_FONT });
  for (const record of records) {
    const title = record.title?.toString().trim();
    const org = record.organization?.toString().trim();
    const loc = record.location?.toString().trim();
    const term = [record.start, record.end].filter(Boolean).join(' - ');
    const header = [title, org, loc, term].filter(Boolean).join(' | ');
    if (header) {
      blocks.push({ text: header, fontSize: BODY_FONT });
    }
    if (record.description) {
      const lines = record.description.toString().split(/\r?\n/);
      for (const line of lines) {
        if (line.trim().length === 0) continue;
        blocks.push({ text: line, fontSize: BODY_FONT });
      }
    }
  }
}

export async function render(payload: unknown = {}): Promise<Uint8Array> {
  const data =
    payload && typeof payload === 'object'
      ? (payload as CvBasicInput)
      : ({} as CvBasicInput);

  const blocks: TextBlock[] = [];
  const name = data.name?.toString().trim() || '候補者';
  const headline = data.headline?.toString().trim();

  blocks.push({ text: name, fontSize: 28 });
  if (headline) {
    blocks.push({ text: headline, fontSize: 18 });
  }

  if (data.profile) {
    const lines = data.profile.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      blocks.push({ text: line, fontSize: BODY_FONT });
    }
  }

  if (Array.isArray(data.qualifications) && data.qualifications.length > 0) {
    blocks.push({ text: '資格・特記事項', fontSize: SECTION_FONT });
    for (const qual of data.qualifications) {
      if (!qual) continue;
      blocks.push({ text: qual.toString(), fontSize: BODY_FONT });
    }
  }

  appendRecord(blocks, '実務経験', data.experience);
  appendRecord(blocks, '学歴', data.education);
  appendRecord(blocks, '出版・業績', data.publications);

  const generatedAt = data.__meta?.generatedAt;
  if (generatedAt) {
    blocks.push({ text: ' ', fontSize: BODY_FONT });
    blocks.push({ text: `生成日時: ${generatedAt}`, fontSize: 10 });
  }

  return createSimplePdf(blocks);
}
