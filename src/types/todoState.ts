import type { Todo, TodoKey } from './todo.js';

export const filterStateList = [`all`, 'priorityHigh', 'closeToDeadline', 'incomplete'] as const;
export type FilterState = (typeof filterStateList)[number];

export type SortOrder = 'ascend' | 'descend';
export type SortState = {
  readonly type: TodoKey;
  readonly order: SortOrder;
};

export type TodoState = {
  todos: Todo[];
  sort: SortState;
  filter: FilterState;
};
