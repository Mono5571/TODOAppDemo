import type { Store } from '../../libs/createStore.js';
import type { TodoState } from '../../types/todoState';
import type { TodoRepository } from './types.js';

export async function initTodoRepository(repo: TodoRepository, todoStore: Store<TodoState>): Promise<void> {
  const result = await repo.findAll();
  if (!result.ok) {
    console.error(result.err);
    return;
  }

  if (result.data.length >= 1) todoStore.dispatch((s) => ({ ...s, todos: result.data }));
}
