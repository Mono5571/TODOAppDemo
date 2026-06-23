import type { Priority, Todo, TodoKey, ValidDeadline } from '../types/todo.js';
import { createStore } from '../libs/createStore.js';
import type { FilterState, TodoState } from '../types/state.js';

export const todoStore = createStore<TodoState>({ todos: [], sort: 'id', filter: 'all' });

/**
 * todoStore の dispatch 処理をまとめたオブジェクト
 *
 * - add: state の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state から削除する
 * - setInitial: state を db.load() が返した Todo[] にする
 */
export const todoActions = {
  add: (newTodo: Todo) => todoStore.dispatch((s) => ({ ...s, todos: [...s.todos, { ...newTodo }] })),
  toggleDone: (id: string) =>
    todoStore.dispatch((s) => ({ ...s, todos: s.todos.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)) })),
  remove: (id: string) => todoStore.dispatch((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) })),
  setInitial: (todos: Todo[]) => todoStore.dispatch((s) => ({ ...s, todos: [...todos] })),
  sortBy: (key: TodoKey) => todoStore.dispatch((s) => ({ ...s, sort: key })),
  filterBy: (filter: FilterState) => todoStore.dispatch((s) => ({ ...s, filter }))
} as const;
