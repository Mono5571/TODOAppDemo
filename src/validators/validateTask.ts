import type { ValidTask } from '../types/todo.js';
import type { Result } from '../types/result.js';
import { createResult } from '../libs/createResult.js';
import { cast } from '../utils/castBranded.js';

export const validateTask = (task: string): Result<ValidTask, Error> => {
  const { createSuccess, createFailure } = createResult<ValidTask, Error>();
  const maxLength = 16;

  const cleanTask = task.trim().replace(/\n/g, ' ');
  const taskLength = [...cleanTask].length;
  if (taskLength === 0) return createFailure(new Error('タイトルを入力してください'));
  if (taskLength >= maxLength + 1) return createFailure(new Error(`${maxLength} 文字以内で入力してください`));

  return createSuccess(cast.task(cleanTask));
};
