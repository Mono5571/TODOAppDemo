import type { Result, Todo } from '@todo/shared';
import { isPriority, isValidDeadline } from '@todo/shared';
import type { TodoRepository } from '../../repositories/todo/type.ts';
import { createUnknownError, type CreateTodoError } from './types/errors.ts';
import { toTodoPersistenceError } from './errors/toTodoPersistenceError.ts';
import { parseValidTask } from './validators/parseValidTask.ts';

export async function createTodo(
  { task, priority, deadline }: { task: unknown; priority: unknown; deadline: unknown },
  repository: TodoRepository
): Promise<Result<Todo, CreateTodoError>> {
  try {
    if (task == null || typeof task !== 'string') return { ok: false, err: { type: 'invalid-task' } };
    const taskValidationResult = parseValidTask(task);
    if (!taskValidationResult.ok) return { ok: false, err: { type: 'invalid-task' } };
    const validTask = taskValidationResult.data;

    if (priority == null || typeof priority !== 'string' || !isPriority(priority))
      return { ok: false, err: { type: 'invalid-priority' } };

    if (deadline == null || typeof deadline !== 'string' || !isValidDeadline(deadline, { checkExpired: true }))
      return { ok: false, err: { type: 'invalid-deadline' } };

    const result = await repository.create({ task: validTask, priority, deadline });

    if (!result.ok) return { ok: false, err: toTodoPersistenceError(result.err) };

    return { ok: true, data: result.data };
  } catch (e) {
    return { ok: false, err: createUnknownError(e) };
  }
}
