import type { InputValues, InputKey, ValidInputs } from '../../../types/inputs.js';
import type { Result } from '../../../types/result.js';
import { createResult } from '../../../libs/createResult.js';
import { validateTask } from './validateTask.js';
import { validatePriority } from './validatePriority.js';
import { validateDeadline } from './validateDeadline.js';
import type { Priority, ValidDeadline, ValidTask } from '../types.js';

function createErrors({
  taskResult,
  priorityResult,
  deadlineResult
}: {
  taskResult: Result<ValidTask, Error>;
  priorityResult: Result<Priority, Error>;
  deadlineResult: Result<ValidDeadline, Error>;
}): Partial<Record<InputKey, string>> {
  const errors: Partial<Record<InputKey, string>> = {};
  if (!taskResult.isSuccess) errors.task = taskResult.error.message;
  if (!priorityResult.isSuccess) errors.priority = priorityResult.error.message;
  if (!deadlineResult.isSuccess) errors.deadline = deadlineResult.error.message;

  return errors;
}

export function validateInputValues(values: InputValues): Result<ValidInputs, Partial<Record<InputKey, string>>> {
  const { createSuccess, createFailure } = createResult<ValidInputs, Partial<Record<InputKey, string>>>();

  const { task, priority, deadline } = values;
  const taskResult = validateTask(task);
  const priorityResult = validatePriority(priority);
  const deadlineResult = validateDeadline(deadline);

  if (taskResult.isSuccess && deadlineResult.isSuccess && priorityResult.isSuccess) {
    return createSuccess({
      task: taskResult.data,
      priority: priorityResult.data,
      deadline: deadlineResult.data
    });
  }

  const errors: Partial<Record<InputKey, string>> = createErrors({ taskResult, priorityResult, deadlineResult });

  return createFailure(errors);
}
