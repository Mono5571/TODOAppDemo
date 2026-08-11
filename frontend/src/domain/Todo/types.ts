import type { Branded } from '@todo/shared';

/**
 * '000001' から '999999' までの連番文字列
 */
export type TodoId = Branded<string, 'TodoId'>;
export const TODO_ID_COUNT_MAX = 999_999;

export type ValidTask = Branded<string, 'ValidTask'>;
export const TASK_MAX_LENGTH = 32;

export const priorityList = ['low', 'middle', 'high'] as const;
export type Priority = (typeof priorityList)[number];

/**
 * 'yyyy-mm-dd' 形式の文字列
 *
 */
export type ValidDeadline = Branded<string, 'ValidDeadline'>;
export const DEADLINE_THRESHOLD_DAYS = 7;

export const todoKeyList = ['id', 'task', 'priority', 'deadline', 'isDone'] as const;
export type TodoKey = (typeof todoKeyList)[number];

interface BaseTodo {
  id: TodoId;
  task: ValidTask;
  priority: Priority;
  deadline: ValidDeadline;
  isDone: boolean;
}

export type Todo = Pick<Readonly<BaseTodo>, TodoKey>;

const _todoCheck = {} as TodoKey satisfies keyof BaseTodo; // todoKeyList にミスがあればコンパイルエラー
