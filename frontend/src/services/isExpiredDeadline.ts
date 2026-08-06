import type { ValidDeadline } from '../domain/Todo/types.js';
import { isFutureOrToday, parseLocalDateNums } from '../utils/dateStringValidator.js';

export function isExpiredDeadline(deadline: ValidDeadline): boolean /* deadline is expired */ {
  const localDateNums = parseLocalDateNums(deadline);

  if (localDateNums === undefined) return false;
  return !isFutureOrToday(...localDateNums);
}
