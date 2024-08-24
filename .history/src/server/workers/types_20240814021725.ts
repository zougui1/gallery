import { type FileExtension, type MimeType } from 'file-type';

export interface FileTypeResult {
  ext: FileExtension | 'txt';
  mime: MimeType | 'text/plain';
}
