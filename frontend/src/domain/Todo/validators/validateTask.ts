import { TASK_MAX_LENGTH } from '@todo/shared';
import type { ValidTask, Result } from '@todo/shared';
import { createResult } from '../../../libs/result.js';
import { cast } from './castBranded.js';

export const validateTask = (task: string): Result<ValidTask, Error> => {
  const { createSuccess, createFailure } = createResult<ValidTask, Error>();

  const cleanTask = task.trim().replace(/\n/g, ' ');

  const taskLength = [...cleanTask].length;
  if (taskLength === 0) return createFailure(new Error('タイトルを入力してください'));
  if (taskLength >= TASK_MAX_LENGTH + 1)
    return createFailure(new Error(`${TASK_MAX_LENGTH} 文字以内で入力してください`));

  return createSuccess(cast.task(cleanTask));
};
