import { isFutureOrToday, isValidDateNums, parseLocalDateNums } from '../../utils/dateStringValidator.js';
import type { ValidDeadline } from '../types.js';

export function isValidDeadline(
  str: string,
  { checkExpired = false }: { checkExpired?: boolean }
): str is ValidDeadline {
  if (str === '') return false;

  const localDateNums = parseLocalDateNums(str);
  if (localDateNums === undefined) return false;
  if (!isValidDateNums(...localDateNums)) return false;
  if (checkExpired && !isFutureOrToday(...localDateNums)) return false;

  return true;
}
