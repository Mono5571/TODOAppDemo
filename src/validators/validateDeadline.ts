import { createResult } from '../libs/createResult.js';
import type { Result } from '../types/result.js';
import type { ValidDeadline } from '../types/todo.js';
import { cast } from '../utils/castBranded.js';
import { isValidDateString } from '../utils/dateStringValidator.js';
import { isFutureOrToday } from '../utils/dateStringValidator.js';

/**
 * 文字列が "適正な締め切りの日付" かを検証する関数
 *
 * チェック項目:
 * - 書式 [yyyy-mm-dd]
 * - 実在する日付か
 * - 今日以降の日付か
 * @param date 検証対象の文字列
 */
export const validateDeadline = (date: string): Result<ValidDeadline, Error> => {
  const { createSuccess, createFailure } = createResult<ValidDeadline, Error>();

  if (date === '') return createFailure(new Error('期日を入力してください'));
  if (!isValidDateString(date)) return createFailure(new Error('入力された日付が存在しないか、無効な形式です'));
  if (!isFutureOrToday(date)) return createFailure(new Error('今日以降の日付を入力してください'));

  return createSuccess(cast.deadline(date));
};
