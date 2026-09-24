import type { Result, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type DeleteTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

export async function deleteTodosMany(
  ids: number[],
  repository: TodoRepository
): Promise<Result<void, DeleteTodoError>> {
  try {
    if (ids.some((id) => Number.isNaN(id) || !Number.isSafeInteger(id)))
      return { ok: false, err: { type: 'invalid-todo-id' } };

    const result = await repository.deleteManyByIds(ids as TodoId[]);
    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };
    if (result.data === 0) return { ok: false, err: { type: 'todo-not-found' } };

    return { ok: true, data: undefined };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
