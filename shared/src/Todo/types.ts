import type { Branded } from '../types/branded.js';
import type { priorityList, todoKeyList } from './constants.js';

export type TodoId = Branded<number, 'TodoId'>;

export type ValidTask = Branded<string, 'ValidTask'>;

export type Priority = (typeof priorityList)[number];

/**
 * 'yyyy-mm-dd' 形式の文字列
 *
 */
export type ValidDeadline = Branded<string, 'ValidDeadline'>;

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
