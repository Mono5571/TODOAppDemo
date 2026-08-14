/**
 * 書式が [yyyy-mm-dd] に沿っていれば { year: number, month: number, day: number } を返す
 *
 * 沿っていなければ undefined を返す
 */
export function parseLocalDateNums(date: string): [number, number, number] | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return undefined;

  const [, y, m, d] = match;

  return [Number(y), Number(m), Number(d)];
}

export function isValidDateNums(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);

  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/**
 * 今日以降の日付かを確認 (時刻を 00:00:00 に揃えて比較)
 *
 * - 入力例：2026-08-05 -> isFutureOrToday(2026, 8, 5)
 *
 */
export function isFutureOrToday(year: number, month: number, day: number): boolean {
  const targetDate = new Date(year, month - 1, day);
  if (!targetDate) return false;
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate >= today;
}
