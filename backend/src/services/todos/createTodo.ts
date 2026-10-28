import type { Result, Todo } from '@todo/shared';
import { isPriority, isValidDeadline } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type CreateTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';
import { parseValidTask } from './validators/parseValidTask.ts';

/**
 * ユーザ入力を検証して新しい TODO を作成し DB に保存する関数
 *
 * - DB に保存された新しい TODO を返す
 * @param inputValues task, priority, deadline としてクライアントから渡された未検証の文字列
 * @param repository DB との境界
 * @returns Result型: 各入力値の検証と DB への保存が
 * 1. 成功 -> 新しい TODO を data として返す
 * 2. 失敗 -> 失敗の種別を err として返す
 */
export async function createTodo(
  { task, priority, deadline }: { task: string; priority: string; deadline: string },
  repository: TodoRepository
): Promise<Result<Todo, CreateTodoError>> {
  try {
    const taskValidationResult = parseValidTask(task);
    if (!taskValidationResult.ok) return { ok: false, err: { type: 'invalid-task' } };
    const validTask = taskValidationResult.data;

    if (!isPriority(priority)) return { ok: false, err: { type: 'invalid-priority' } };

    if (!isValidDeadline(deadline, { shouldCheckExpired: true }))
      return { ok: false, err: { type: 'invalid-deadline' } };

    const result = await repository.create({ task: validTask, priority, deadline });

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };

    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
