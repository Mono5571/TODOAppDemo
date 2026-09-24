import type { TodoId } from '@todo/shared';

export function isNumberArray(array: unknown[]): array is number[] {
  if (array.some((el) => typeof el !== 'number')) return false;
  return true;
}
