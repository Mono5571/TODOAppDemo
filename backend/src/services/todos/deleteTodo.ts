import type { Result, TodoId } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type DeleteTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';

/**
 * id で指定された TODO を DB から削除する
 * @param id クライアントから渡ってきた対象の TODO の識別子
 * @param repository TODO の永続化を担う Repository のインスタンス
 * @returns Promise にラップされた Result 型:
 * 1. **成功** -> data: true
 *
 * 2. **失敗**
 * - id が不正な値 -> { type: 'invalid-todo-id' }
 * - 指定した TODO が保存されていない -> { type: 'todo-not-found' }
 */
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
