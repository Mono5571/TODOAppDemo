import { isFutureOrToday, isValidDateNums, parseLocalDateNums } from '../../utils/dateStringValidator.js';
import type { ValidDeadline } from '../types.js';

export function isValidDeadline(
  str: string,
  { shouldCheckExpired = false }: { shouldCheckExpired?: boolean }
): str is ValidDeadline {
  if (str === '') return false;

  const localDateNums = parseLocalDateNums(str);
  if (localDateNums === undefined) return false;
  if (!isValidDateNums(...localDateNums)) return false;
  if (shouldCheckExpired && !isFutureOrToday(...localDateNums)) return false;

  return true;
}
