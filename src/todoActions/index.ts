import type { FilterState, SortState } from '../types/state.js';
import type { Todo, TodoKey } from '../types/todo.js';
import { todoStore } from '../TodoStore/index.js';
import { commitTodos } from '../todoPersistence/index.js';

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
 * db.save() を経由:
 * - add: state.todos の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state.todos から削除する
 *
 * db.save() を迂回:
 * - toggoleSort: state.sort の変更 -- type 書き換え、 type 同じなら order 逆に
 * - filterBy: state.filter を書き換える
 */
export const todoActions = {
  // todos の変更 -> commitTodos (db.save()) 経由
  add: (todo: Todo) => commitTodos((todos) => [...todos, todo]),
  toggleDone: (id: string) => commitTodos((todos) => todos.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))),
  remove: (id: string) => commitTodos((todos) => todos.filter((t) => t.id !== id)),
  // filter, sort の変更 -> そのまま dispatch
  toggleSort: (type: TodoKey) => todoStore.dispatch((s) => ({ ...s, sort: toggleSortHelper(s.sort, type) })),
  filterBy: (filter: FilterState) => todoStore.dispatch((s) => ({ ...s, filter }))
} as const;
