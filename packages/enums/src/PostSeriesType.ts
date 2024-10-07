import { getEnumValues } from './utils';

export enum PostSeriesType {
  comic = 'comic',
  story = 'story',
}

export const postSeriesTypeValues = getEnumValues(PostSeriesType);
