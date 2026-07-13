import type { FilterState, SortState, TodoState } from '../../types/todoState.js';
import type { Todo } from '../../types/todo.js';
import { computeViewTodos } from './computeViewTodos.js';

/**
 * view を組み立てる処理を登録する際に todoStore.watch() の第一引数にわたす selector
 *
 * - IIFE で作成される (state: TodoState) => Todo[] :: 前回の state をメモ化するため
 * - state に変更がなければ、戻り値も変わらない :: 参照が変わらないので、 isEqual((a, b) => a === b) -> true
 */
export const selectViewTodos = (() => {
  // memoize
  let prevTodos: Todo[] | undefined;
  let prevFilter: FilterState | undefined;
  let prevSort: SortState | undefined;
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
