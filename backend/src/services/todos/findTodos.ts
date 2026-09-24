import type { Result, Todo } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type FindTodosError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

export async function findTodos(repostory: TodoRepository): Promise<Result<Todo[], FindTodosError>> {
  try {
    const result = await repostory.findAll();

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };
    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
