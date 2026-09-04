import { isFutureOrToday, isValidDateNums, parseLocalDateNums, TASK_MAX_LENGTH } from '@todo/shared';
import type { Result, TodoId, ValidDeadline, ValidTask } from '@todo/shared';

// --- delete later ---
export const validateDeadline = (date: string): Result<ValidDeadline, Error> => {
  if (date === '') return { ok: false, err: new Error('期日を入力してください') };

  const localDateNums = parseLocalDateNums(date);

  if (localDateNums === undefined) return { ok: false, err: new Error('日付が無効な形式です') };

  if (!isValidDateNums(...localDateNums)) return { ok: false, err: new Error('入力された日付が存在しません') };

  if (!isFutureOrToday(...localDateNums)) return { ok: false, err: new Error('今日以降の日付を入力してください') };

  // return createSuccess(cast.deadline(date));
  return { ok: true, data: date as ValidDeadline };
};

// バックエンドのバリデーションはもっと丁寧に
export const validateTask = (task: string): Result<ValidTask, Error> => {
  const cleanTask = task.trim().replace(/\n/g, ' ');

  const taskLength = [...cleanTask].length;
  if (taskLength === 0) return { ok: false, err: new Error('タイトルを入力してください') };
  if (taskLength >= TASK_MAX_LENGTH + 1)
    return { ok: false, err: new Error(`${TASK_MAX_LENGTH} 文字以内で入力してください`) };

  return { ok: true, data: cleanTask as ValidTask };
};
