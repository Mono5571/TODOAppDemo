import type { Branded } from '../types/branded.js';

export type DateString = Branded<string, 'DateString'>;

/**
 * 書式と実在する日付かを確認
 */
export const isValidDateString = (date: string): date is DateString => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  // Dateオブジェクトに入れて、実在しない日付（2/31など）が修正されないか確認
  const d = new Date(date);
  return d instanceof Date && !Number.isNaN(d.getTime()) && d.toISOString().startsWith(date);
};

function parseLocalDate(date: string): Date | undefined {
  if (!isValidDateString(date)) return;
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y as number, (m as number) - 1, d); // DateString なら y != null && m != null
}

/**
 * 今日以降の日付かを確認 (時刻を 00:00:00 に揃えて比較)
 */
export function isFutureOrToday(date: string): boolean {
  const targetDate = parseLocalDate(date);
  if (!targetDate) return false;
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate >= today;
}
