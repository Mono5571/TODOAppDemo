import type { TodoKey } from '../../types/todo.js';

export type MaybeTodo = {
  readonly id: string;
  readonly task: string;
  readonly priority: string;
  readonly deadline: string;
  readonly isDone: boolean;
};

const _maybeTodocheck = {} as TodoKey satisfies keyof MaybeTodo;
