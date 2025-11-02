declare module "@react-pdf/renderer" {
  import type { ReactElement, ReactNode, FC } from "react";

  export interface StyleDefinition {
    [key: string]: any;
  }

  export const Document: FC<{ children?: ReactNode }>;
  export const Page: FC<{ children?: ReactNode; size?: string | [number, number]; style?: any }>;
  export const View: FC<{ children?: ReactNode; style?: any }>;
  export const Text: FC<{ children?: ReactNode; style?: any }>;

  export const StyleSheet: {
    create<T extends StyleDefinition>(styles: T): T;
  };

  export const Font: {
    register: (options: any) => void;
  };

  export function renderToBuffer(element: ReactElement): Promise<Uint8Array>;
}
