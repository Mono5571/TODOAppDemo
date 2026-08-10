import { createResult } from '../../../libs/result.js';
import type { Result } from '@shared/types';
import type { ValidDeadline } from '../types.js';
import { cast } from './castBranded.js';
import { isFutureOrToday, isValidDateNums, parseLocalDateNums } from '../../../utils/dateStringValidator.js';

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

  const localDateNums = parseLocalDateNums(date);

  if (localDateNums === undefined) return createFailure(new Error('日付が無効な形式です'));

  if (!isValidDateNums(...localDateNums)) return createFailure(new Error('入力された日付が存在しません'));

  if (!isFutureOrToday(...localDateNums)) return createFailure(new Error('今日以降の日付を入力してください'));

  return createSuccess(cast.deadline(date));
};
