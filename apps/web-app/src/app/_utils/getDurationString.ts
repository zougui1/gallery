import { MS } from '@zougui/common.ms';

export const getDurationString = (milliseconds: number, options?: MS.ToStringOptions): string => {
  // removes seconds from the results
  const roundedMilliseconds = Math.round(milliseconds / 60_000) * 60_000;
  return MS.toString(roundedMilliseconds, options);
}
