import { parseLocalDateNums, type TodoId, type ValidDeadline, type ValidTask } from '@todo/shared';

// 暫定的なもの

export function toTodoId(id: number): TodoId {
  return id as TodoId;
}

export function toTask(task: string): ValidTask {
  return task as ValidTask;
}

export function deadlineToDate(deadline: ValidDeadline): Date {
  // ValidDeadline なので、parseLocalDateNums(deadline) は数値タプルにアサーションしていい
  const [year, month, date] = parseLocalDateNums(deadline) as [number, number, number];

  return new Date(Date.UTC(year, month - 1, date));
}

export function dateToDeadline(date: Date): ValidDeadline {
  return date.toISOString().slice(0, 10) as ValidDeadline;
}
