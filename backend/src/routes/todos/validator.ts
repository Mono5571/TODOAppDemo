import { TASK_MAX_LENGTH, type Result, type TodoId, type ValidDeadline, type ValidTask } from '@todo/shared';

export function isTodoId(str: string): str is TodoId {
  return /^(?!000000$)[0-9]{6}$/.test(str);
}

// --- delete later ---
function parseLocalDateNums(date: string): [number, number, number] | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return undefined;

  const [, y, m, d] = match;

  return [Number(y), Number(m), Number(d)];
}

function isValidDateNums(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);

  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function isFutureOrToday(year: number, month: number, day: number): boolean {
  const targetDate = new Date(year, month - 1, day);
  if (!targetDate) return false;
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate >= today;
}

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
