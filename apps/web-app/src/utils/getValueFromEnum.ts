import { getEnumValues } from '.'

export const getValueFromEnum = <T extends string>(enumeration: Record<string, T>, value: unknown): T | undefined => {
  const values = getEnumValues(enumeration);

  if (values.includes(value as T)) {
    return value as T;
  }
}
