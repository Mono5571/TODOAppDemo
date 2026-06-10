import type { Todo } from '../types/todo.js';
import { createStore } from '../libs/createStore.js';

export const todoStore = createStore<Todo[]>([]);

export const todoActions = {
  add: (newTodo: Todo) => todoStore.dispatch((s) => [...s, newTodo]),
  toggleDone: (id: string) => todoStore.dispatch((s) => s.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))),
  remove: (id: string) => todoStore.dispatch((s) => s.filter((t) => t.id !== id)),
  setInitial: (todos: Todo[]) => todoStore.dispatch((_) => [...todos])
};
