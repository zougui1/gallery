export const  multiSort = <T>(array: T[], criteria: SortCriteria<T>[]): T[] => {
  return array.sort((a, b) => {
    for (const { fn, order = 'asc' } of criteria) {
      const aValue = fn(a);
      const bValue = fn(b);

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
    }

    return 0; // if all criteria are equal
  });
}

export interface SortCriteria<T> {
  fn: (data: T) => string | number | Date;
  order?: 'asc' | 'desc'; // Optional, defaults to 'asc'
}
