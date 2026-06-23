import type { Todo, TodoKey } from './todo.js';

const filterStateList = [`all`, 'priority', 'closeToDeadline', 'incomplete'] as const;

export type FilterState = (typeof filterStateList)[number];

export type TodoState = {
  todos: Todo[];
  sort: TodoKey;
  filter: FilterState;
};
