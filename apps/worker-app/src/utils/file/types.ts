// @ts-ignore ignore the error for the ESM module as only the types are imported
import type { FileExtension, MimeType } from 'file-type';

export interface FileTypeResult {
  ext: FileExtension | 'txt';
  mime: MimeType | 'text/plain';
}

export interface FileDownloadResult extends FileTypeResult {
  path: string;
}

export type ThumbnailImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';
