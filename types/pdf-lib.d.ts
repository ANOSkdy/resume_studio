declare module "pdf-lib" {
  export class PDFDocument {
    static create(options?: any): Promise<PDFDocument>;
    addPage(size?: any): any;
    embedFont(font: Uint8Array | ArrayBuffer | Buffer | string, options?: any): Promise<any>;
    registerFontkit(fontkit: any): void;
    save(options?: any): Promise<Uint8Array>;
  }

  export const rgb: (...args: any[]) => any;
  export const StandardFonts: Record<string, string>;
}

declare module "@pdf-lib/fontkit" {
  const fontkit: any;
  export default fontkit;
}
