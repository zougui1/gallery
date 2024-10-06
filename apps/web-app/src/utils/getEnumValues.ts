export const getEnumValues = <T extends string>(enumeration: Record<string, T>): [T, ...T[]] => {
  return Object.values(enumeration) as [T, ...T[]];
}
