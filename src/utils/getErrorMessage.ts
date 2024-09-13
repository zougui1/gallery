import { isObject } from 'radash';

export function getErrorMessage(value: unknown): string | undefined;
export function getErrorMessage(value: unknown, defaultMessage: string): string;
export function getErrorMessage(value: unknown, options: { defaultMessage: string; withCause?: WithCause }): string;
export function getErrorMessage(value: unknown, defaultMessage?: string): string | undefined;
export function getErrorMessage(value: unknown, optionsOrDefaultMessage?: string | GetErrorMessageOptions): string | undefined;
export function getErrorMessage(value: unknown, optionsOrDefaultMessage?: string | GetErrorMessageOptions): string | undefined {
  const { defaultMessage, withCause } = isObject(optionsOrDefaultMessage)
    ? optionsOrDefaultMessage
    : { defaultMessage: optionsOrDefaultMessage, withCause: undefined };

  if (
    isObject(value) &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.trim()
  ) {
    const cause = 'cause' in value ? `: ${withCause?.(value.cause)}` : undefined;
    return `${value.message}${cause}`;
  }

  return defaultMessage;
}

export type WithCause = (cause: unknown) => string | undefined;

export interface GetErrorMessageOptions {
  defaultMessage?: string;
  withCause?: WithCause;
}
