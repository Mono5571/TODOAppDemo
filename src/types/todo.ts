import type { Branded } from './branded.js';
// --- todoTypes ---
export type TodoId = Branded<string, 'TodoId'>;

export type ValidTask = Branded<string, 'ValidTask'>;
export const priorityList = ['low', 'middle', 'high'] as const;
export type Priority = (typeof priorityList)[number];

export type ValidDeadline = Branded<string, 'ValidDeadline'>;

export const todoKeyList = ['id', 'task', 'priority', 'deadline', 'isDone'] as const;
export type TodoKey = (typeof todoKeyList)[number];

interface BaseTodo {
  id: TodoId;
  task: ValidTask;
  priority: Priority;
  deadline: ValidDeadline;
  isDone: boolean;
}

export type Todo = Pick<BaseTodo, TodoKey>;

const _todoCheck = {} as TodoKey satisfies keyof BaseTodo; // todoKeyList にミスがあればコンパイルエラー
