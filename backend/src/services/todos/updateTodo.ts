import type { Result, Todo, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type UpdateTodoIsDoneError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

export async function updateIsDone(
  { id, isDone }: { id: unknown; isDone: unknown },
  repositoriy: TodoRepository
): Promise<Result<Todo, UpdateTodoIsDoneError>> {
  try {
    // validate id, isDone
    if (id == null || typeof id !== 'number' || Number.isNaN(id) || !Number.isInteger(id))
      return { ok: false, err: { type: 'invalid-todo-id' } };
    if (isDone == null || typeof isDone !== 'boolean') return { ok: false, err: { type: 'invalid-is-done' } };

    const result = await repositoriy.updateIsDone(id as TodoId, isDone);

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };

    if (result.data === null) return { ok: false, err: { type: 'todo-not-found' } };

    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
