import { type FileTypeResult } from 'file-type';

declare module 'file-type' {
  export function fileTypeFromFile(filePath: string): Promise<FileTypeResult | undefined>;
}
