import { DateTime } from 'luxon';

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
  return DateTime.fromJSDate(date).toLocaleString(options);
}
