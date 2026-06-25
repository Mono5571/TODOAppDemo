import type { Todo, TodoKey } from '../types/todo.js';
import { createStore } from '../libs/createStore.js';
import type { FilterState, SortState, TodoState } from '../types/state.js';

export const todoStore = createStore<TodoState>({ todos: [], sort: { type: 'id', order: 'ascend' }, filter: 'all' });

/**
 * toggleSort の補助関数
 *
 * - sort タイプが同じなら昇順 / 降順の切り替え
 * - sort タイプが異なるなら、タイプを切り替えて昇順に
 * @param current
 * @param type
 * @returns
 */
function toggleSortHelper(current: SortState, type: TodoKey): SortState {
  if (current.type === type) return { type, order: current.order === 'ascend' ? 'descend' : 'ascend' };
  return { type, order: 'ascend' };
}

/**
 * todoStore の dispatch 処理をまとめたオブジェクト
 *
 * - add: state.todos の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state.todos から削除する
 * - setInitial: state.todos を db.load() が返した Todo[] にする
 * - toggoleSort: state.sort の変更 -- type 書き換え、 type 同じなら order 逆に
 * - filterBy: state.filter を書き換える
 */
export const todoActions = {
  add: (newTodo: Todo) => todoStore.dispatch((s) => ({ ...s, todos: [...s.todos, { ...newTodo }] })),
  toggleDone: (id: string) =>
    todoStore.dispatch((s) => ({ ...s, todos: s.todos.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)) })),
  remove: (id: string) => todoStore.dispatch((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) })),
  setInitial: (todos: Todo[]) => todoStore.dispatch((s) => ({ ...s, todos: [...todos] })),
  toggleSort: (type: TodoKey) => todoStore.dispatch((s) => ({ ...s, sort: toggleSortHelper(s.sort, type) })),
  filterBy: (filter: FilterState) => todoStore.dispatch((s) => ({ ...s, filter }))
} as const;
