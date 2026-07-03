import type { Todo } from '../types/todo.js';
import { createDB } from '../TodoDB/createDB.js';
import { mockInitialData } from './test/test_mockDB.js';
import { todoStore } from '../TodoStore/index.js';
import type { TodoState } from '../types/state.js';

export const db = createDB({ label: 'mock', initialData: mockInitialData });

export async function commitTodos(updater: (todos: Todo[]) => Todo[]) {
  const current = todoStore.state;
  const next: TodoState = {
    ...current,
    todos: updater(current.todos)
  };

  try {
    await db.save(next.todos); // throwable

    todoStore.dispatch(() => next);
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    console.error('unknow error occured.');
  }
}
