const defaultPredicate = (v: unknown) => v;

export const toggleArrayItem = <T>(array: T[], item: T, predicate: (item: T) => unknown = defaultPredicate): T[] => {
  const itemValue = predicate(item);

  if (!array.some(v => predicate(v) === itemValue)) {
    return [...array, item];
  }

  return array.filter(v => predicate(v) !== itemValue);
}
