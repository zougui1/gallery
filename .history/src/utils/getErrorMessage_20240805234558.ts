export function getErrorMessage(value: unknown, defaultErrorMessage: string): string;
export function getErrorMessage(value: unknown, defaultErrorMessage?: string): string | undefined;
export function getErrorMessage(value: unknown, defaultErrorMessage?: string): string | undefined {
  if (
    value &&
    typeof value === 'object' &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.trim()
  ) {
    return value.message;
  }

  return defaultErrorMessage;
}
