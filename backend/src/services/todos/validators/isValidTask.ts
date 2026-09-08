import { TASK_MAX_LENGTH, type ValidTask } from '@todo/shared';

export function createValidTask(str: string): ValidTask | null {
  const cleanStr = str.trim().replace(/\n/g, ' ');

  const strLength = [...cleanStr].length;
  if (strLength === 0 || strLength >= TASK_MAX_LENGTH + 1) return null;

  // 中身の検証
  // ...

  return cleanStr as ValidTask;
}
