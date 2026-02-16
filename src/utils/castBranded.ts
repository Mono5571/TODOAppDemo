import type { TodoId, ValidDeadline, ValidTask } from '../types/todo.js';

export const cast = {
  todoId: (id: string) => id as TodoId,
  task: (s: string) => s as ValidTask,
  deadline: (d: string) => d as ValidDeadline
};
