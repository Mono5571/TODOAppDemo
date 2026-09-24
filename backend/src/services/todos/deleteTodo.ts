import type { Result, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type DeleteTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

export async function deleteTodo(id: number, repository: TodoRepository): Promise<Result<true, DeleteTodoError>> {
  try {
    if (Number.isNaN(id)) return { ok: false, err: { type: 'invalid-todo-id' } };
    if (!Number.isSafeInteger(id)) return { ok: false, err: { type: 'invalid-todo-id' } };

    const result = await repository.deleteById(id as TodoId);
    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };
    if (result.data === false) return { ok: false, err: { type: 'todo-not-found' } };

    return { ok: true, data: true };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
