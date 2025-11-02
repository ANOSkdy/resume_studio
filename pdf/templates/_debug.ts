import { createSimplePdf, type TextBlock } from './shared/simplePdf';

type DebugInput = {
  name?: string;
  __meta?: {
    type?: string;
    template?: string;
    generatedAt?: string;
  };
  [key: string]: unknown;
};

export async function render(payload: unknown = {}): Promise<Uint8Array> {
  const data =
    payload && typeof payload === 'object'
      ? (payload as DebugInput)
      : ({} as DebugInput);

  const blocks: TextBlock[] = [];
  const title = data.name?.toString().trim() || 'Debug PDF';
  blocks.push({ text: title, fontSize: 24 });
  blocks.push({ text: 'テンプレート: _debug', fontSize: 12 });

  if (data.__meta) {
    const { type, template, generatedAt } = data.__meta;
    blocks.push({ text: `type: ${type ?? 'n/a'}`, fontSize: 12 });
    blocks.push({ text: `template: ${template ?? 'n/a'}`, fontSize: 12 });
    if (generatedAt) {
      blocks.push({ text: `generatedAt: ${generatedAt}`, fontSize: 10 });
    }
  }

  const clone = { ...data };
  delete clone.__meta;

  const summary = JSON.stringify(clone, null, 2);
  const lines = summary.split(/\r?\n/);
  for (const line of lines) {
    blocks.push({ text: line, fontSize: 10 });
  }

  return createSimplePdf(blocks);
}
