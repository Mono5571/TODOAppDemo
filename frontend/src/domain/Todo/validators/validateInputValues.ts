import { type InputValues, type InputKey, type InputTodo, inputKeyList } from '../../../types/inputs.js';
import type { Result } from '@todo/shared';
import { createResult } from '../../../libs/result.js';
import { validateTask } from './validateTask.js';
import { validatePriority } from './validatePriority.js';
import { validateDeadline } from './validateDeadline.js';

export type ValidationResults<T, E> = { [k in keyof T]: Result<T[k], E> };

export function createErrors<T, E extends { message: string }>(
  keys: readonly (keyof T)[],
  results: ValidationResults<T, E>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  keys.forEach((key) => {
    if (!results[key].ok) errors[key] = results[key].err.message;
  });

  return errors;
}

export function validateInputValues({
  task,
  priority,
  deadline
}: InputValues): Result<InputTodo, Partial<Record<InputKey, string>>> {
  const { createSuccess, createFailure } = createResult<InputTodo, Partial<Record<InputKey, string>>>();

  const results: ValidationResults<InputTodo, Error> = {
    task: validateTask(task),
    priority: validatePriority(priority),
    deadline: validateDeadline(deadline)
  };

  if (results.task.ok && results.priority.ok && results.deadline.ok) {
    return createSuccess({
      task: results.task.data,
      priority: results.priority.data,
      deadline: results.deadline.data
    });
  }

  const errors: Partial<Record<InputKey, string>> = createErrors<InputTodo, Error>(inputKeyList, results);

  return createFailure(errors);
}
