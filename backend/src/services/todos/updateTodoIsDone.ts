import type { Result, Todo, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type UpdateTodoIsDoneError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

/**
 * id で指定された TODO の isDone を、入力された通りに更新する関数
 *
 * 検証:
 * 1. id -> 安全な非負整数か (対象の TODO の存在はこの段階では検証しない)
 * 2. isDone -> bool 値か
 * 3. DB への保存 -> 対象の TODO が存在するか
 * @param input クライアントから API 経由で渡ってきた未検証の id と isDone
 * @param repository TodoRepository
 * @returns Result 型:
 * 1. 成功 -> data: isDone を更新した TODO
 * 2. 失敗 -> err: { type: 'todo-not-found' } | { type: 'persistence-error' } | { type: 'unknown-error'; cause: unknown }
 */
export async function updateTodoIsDone(
  { id, isDone }: { id: number; isDone: boolean },
  repository: TodoRepository
): Promise<Result<Todo, UpdateTodoIsDoneError>> {
  try {
    // validate id, isDone
    if (Number.isNaN(id)) return { ok: false, err: { type: 'invalid-todo-id' } };
    if (!Number.isSafeInteger(id) || id < 0) return { ok: false, err: { type: 'invalid-todo-id' } };

    if (isDone !== true && isDone !== false) return { ok: false, err: { type: 'invalid-is-done' } };

    const result = await repository.updateIsDone(id as TodoId, isDone);

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };

    if (result.data === null) return { ok: false, err: { type: 'todo-not-found' } };

    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
