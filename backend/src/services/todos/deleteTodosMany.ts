import type { Result, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type DeleteTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

/**
 * DB に保存済みの複数の TODO を指定して削除する関数
 * @param ids クライアントから渡ってきた配列
 * @param repository TODO の永続化を担う Repository のインスタンス
 * @returns Promise でラップされた Result 型:
 * 1. **成功** -> void
 * 2. **失敗** ->
 *    - ids に不正な値が含まれている -> err: { type: 'invalid-todo-id' }
 *    - ひとつも TODO を削除できなかった -> err: { type: 'todo-not-found' }
 */
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
