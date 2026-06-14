import type { Todo } from '../types/todo.js';
import { createStore } from '../libs/createStore.js';

export const todoStore = createStore<Todo[]>([]);

/**
 * todoStore の dispatch 処理をまとめたオブジェクト
 *
 * - add: state の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state から削除する
 * - setInitial: state を db.load() が返した Todo[] にする
 */
export const todoActions = {
  add: (newTodo: Todo) => todoStore.dispatch((s) => [...s, newTodo]),
  toggleDone: (id: string) => todoStore.dispatch((s) => s.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))),
  remove: (id: string) => todoStore.dispatch((s) => s.filter((t) => t.id !== id)),
  setInitial: (todos: Todo[]) => todoStore.dispatch((_) => [...todos])
} as const;
