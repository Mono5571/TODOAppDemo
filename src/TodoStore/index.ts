import type { Todo } from '../types/todo.js';
import { createStore } from '../libs/createStore.js';
import type { ValidInputs } from '../types/inputs.js';
import { generateTodoId } from '../utils/generateTodoId.js';

export const todoStore = createStore<Todo[]>([]);

export const todoActions = {
  add: (validData: ValidInputs) =>
    todoStore.dispatch((s) => [...s, { ...validData, id: generateTodoId(), isDone: false }]),
  toggleDone: (id: string) => todoStore.dispatch((s) => s.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))),
  remove: (id: string) => todoStore.dispatch((s) => s.filter((t) => t.id !== id))
};
