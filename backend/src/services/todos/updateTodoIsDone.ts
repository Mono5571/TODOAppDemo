import type { Result, Todo, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type UpdateTodoIsDoneError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

export async function updateTodoIsDone(
  { id, isDone }: { id: number; isDone: boolean },
  repository: TodoRepository
): Promise<Result<Todo, UpdateTodoIsDoneError>> {
  try {
    // validate id, isDone
    if (Number.isNaN(id)) return { ok: false, err: { type: 'invalid-todo-id' } };
    if (!Number.isSafeInteger(id)) return { ok: false, err: { type: 'invalid-todo-id' } };

    if (isDone !== true && isDone !== false) return { ok: false, err: { type: 'invalid-is-done' } };

    const result = await repository.updateIsDone(id as TodoId, isDone);

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };

    if (result.data === null) return { ok: false, err: { type: 'todo-not-found' } };

    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
