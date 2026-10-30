import type { Result, Todo } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type FindTodosError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

/**
 * TodoRepository を介して DB に保存された TODO をすべて取り出す
 * @param repository TodoRepository
 * @returns Result 型:
 * 1. 成功 -> data: DB に保存されているすべての TODO
 * 2. 失敗 -> err: { type: 'persistence-error' } | { type: 'unknown-error'; cause: unknown }
 */
export async function findTodos(repository: TodoRepository): Promise<Result<Todo[], FindTodosError>> {
  try {
    const result = await repository.findAll();

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };
    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
