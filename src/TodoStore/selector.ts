import type { FilterState, TodoState } from '../types/state.js';
import type { Todo, TodoKey } from '../types/todo.js';
import { computeViewTodos } from './computeViewTodos.js';

export const selectViewTodos = (() => {
  // memoize
  let prevTodos: Todo[] | undefined;
  let prevFilter: FilterState | undefined;
  let prevSort: TodoKey | undefined;
  let result: Todo[] = [];

  return (state: TodoState) => {
    if (state.todos === prevTodos && state.filter === prevFilter && state.sort === prevSort) {
      return result;
    }

    prevTodos = state.todos;
    prevFilter = state.filter;
    prevSort = state.sort;

    result = computeViewTodos(state);

    return result;
  };
})();
