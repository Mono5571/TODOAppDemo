import { type InputValues, type InputKey, type ValidInputs, inputKeyList } from '../../../types/inputs.js';
import type { Result } from '../../../types/result.js';
import { createResult } from '../../../libs/createResult.js';
import { validateTask } from './validateTask.js';
import { validatePriority } from './validatePriority.js';
import { validateDeadline } from './validateDeadline.js';

export function createErrors<
  K extends string | number | symbol,
  T extends { [k in K]: unknown },
  E extends { message: string }
>(keys: readonly K[], results: { [k in K]: Result<T[k], E> }): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};

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

  const errors: Partial<Record<InputKey, string>> = createErrors(inputKeyList, results);

  return createFailure(errors);
}
