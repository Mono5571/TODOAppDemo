import { type InputValues, type InputKey, type ValidInputs, inputKeyList } from '../../../types/inputs.js';
import type { Result } from '../../../types/result.js';
import { createResult } from '../../../libs/result.js';
import { validateTask } from './validateTask.js';
import { validatePriority } from './validatePriority.js';
import { validateDeadline } from './validateDeadline.js';

export function createErrors<T, E extends { message: string }>(
  keys: readonly (keyof T)[],
  results: { [k in keyof T]: Result<T[k], E> }
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
}: InputValues): Result<ValidInputs, Partial<Record<InputKey, string>>> {
  const { createSuccess, createFailure } = createResult<ValidInputs, Partial<Record<InputKey, string>>>();

  const results = {
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

  const errors: Partial<Record<InputKey, string>> = createErrors<ValidInputs, Error>(inputKeyList, results);

  return createFailure(errors);
}
