import type { TodoId, ValidDeadline, ValidTask } from '@todo/shared';

export const cast = {
  todoId: (id: number) => id as TodoId,
  task: (s: string) => s as ValidTask,
  deadline: (d: string) => d as ValidDeadline
};
