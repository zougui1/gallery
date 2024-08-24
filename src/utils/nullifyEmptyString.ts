export const nullifyEmptyString = <T>(value: T): T | undefined => {
  return value === '' ? undefined : value;
}
