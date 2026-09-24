import { parseLocalDateNums, type TodoId, type ValidDeadline, type ValidTask } from '@todo/shared';
import type { TodoRepositoryError } from './type.ts';
import type { Priority } from '../../generated/prisma/enums.ts';

// 暫定的なもの
function toTodoId(id: number): TodoId {
  return id as TodoId;
}
// 暫定的なもの
function toTask(task: string): ValidTask {
  return task as ValidTask;
}

export function deadlineToDate(deadline: ValidDeadline): Date {
  // ValidDeadline なので、parseLocalDateNums(deadline) は数値タプルにアサーションしていい
  const [year, month, date] = parseLocalDateNums(deadline) as [number, number, number];

  return new Date(Date.UTC(year, month - 1, date));
}

function dateToDeadline(date: Date): ValidDeadline {
  return date.toISOString().slice(0, 10) as ValidDeadline;
}

export function toDomainTodo(data: { id: number; task: string; priority: Priority; deadline: Date; isDone: boolean }) {
  return {
    id: toTodoId(data.id),
    task: toTask(data.task),
    priority: data.priority,
    deadline: dateToDeadline(data.deadline),
    isDone: data.isDone
  };
}
