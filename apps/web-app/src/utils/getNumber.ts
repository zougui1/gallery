import { isNumber } from 'radash';

export const getNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return;
  }

  const num = Number(value);

  if (isNumber(num)) {
    return num;
  }
}
