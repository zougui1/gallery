export const removeTrailing = (str: string, subStr: string): string => {
  if (!subStr.length || !str.endsWith(subStr)) {
    return str;
  }

  return str.slice(0, -subStr.length);
}
