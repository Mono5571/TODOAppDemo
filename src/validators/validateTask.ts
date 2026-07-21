import type { ValidTask } from '../types/todo.js';
import type { Result } from '../types/result.js';
import { createResult } from '../libs/createResult.js';
import { cast } from '../utils/castBranded.js';

const MAX_LENGTH = 32;

export const validateTask = (task: string): Result<ValidTask, Error> => {
  const { createSuccess, createFailure } = createResult<ValidTask, Error>();

  const cleanTask = task.trim().replace(/\n/g, ' ');
  const taskLength = [...cleanTask].length;
  if (taskLength === 0) return createFailure(new Error('タイトルを入力してください'));
  if (taskLength >= MAX_LENGTH + 1) return createFailure(new Error(`${MAX_LENGTH} 文字以内で入力してください`));

  return createSuccess(cast.task(cleanTask));
};
