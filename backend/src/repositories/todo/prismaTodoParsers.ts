import type { TodoId, ValidDeadline, ValidTask } from '@todo/shared';

// 暫定的なもの

export function toTodoId(id: number): TodoId {
  return id as TodoId;
}

export function toTask(task: string): ValidTask {
  return task as ValidTask;
}

export function toDeadline(date: Date): ValidDeadline {
  const [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  return `${y}-${m}-${d}` as ValidDeadline;
}
