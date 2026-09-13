import type { Result, Todo } from '@todo/shared';
import { isPriority, isValidDeadline } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type CreateTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';
import { parseValidTask } from './validators/parseValidTask.ts';

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
