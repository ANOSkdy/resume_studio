import { Buffer } from 'node:buffer';

const DEFAULT_FONT = '/F1';

function escapePdfText(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export type TextBlock = {
  text: string;
  fontSize: number;
};

function buildContentStream(blocks: TextBlock[]): Buffer {
  const lines: string[] = [];
  let currentY = 750;

  for (const block of blocks) {
    lines.push('BT');
    lines.push(`${DEFAULT_FONT} ${block.fontSize} Tf`);
    lines.push(`72 ${currentY} Td`);
    lines.push(`(${escapePdfText(block.text)}) Tj`);
    lines.push('ET');
    currentY -= block.fontSize + 6;
  }

  const content = lines.join('\n');
  return Buffer.from(content, 'utf8');
}

export function createSimplePdf(blocks: TextBlock[]): Uint8Array {
  const header = Buffer.from('%PDF-1.4\n', 'utf8');
  const contentStream = buildContentStream(blocks);

  const objects: Buffer[] = [];

  objects.push(
    Buffer.from(
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      'utf8',
    ),
  );

  objects.push(
    Buffer.from(
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      'utf8',
    ),
  );

  objects.push(
    Buffer.from(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
      'utf8',
    ),
  );

  objects.push(
    Buffer.concat([
      Buffer.from(
        `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n`,
        'utf8',
      ),
      contentStream,
      Buffer.from('\nendstream\nendobj\n', 'utf8'),
    ]),
  );

  objects.push(
    Buffer.from(
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      'utf8',
    ),
  );

  const buffers: Buffer[] = [header];
  const offsets: number[] = [];
  let offset = header.length;

  for (const object of objects) {
    offsets.push(offset);
    buffers.push(object);
    offset += object.length;
  }

  const xrefOffset = offset;
  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += '0000000000 65535 f \n';
  for (const entry of offsets) {
    xref += `${entry.toString().padStart(10, '0')} 00000 n \n`;
  }

  buffers.push(Buffer.from(xref, 'utf8'));

  buffers.push(
    Buffer.from(
      `trailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
      'utf8',
    ),
  );

  return new Uint8Array(Buffer.concat(buffers));
}
