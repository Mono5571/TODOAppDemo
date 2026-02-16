import type { Result } from '../types/result.js';
import type { Priority } from '../types/todo.js';
import { isPriority } from '../utils/todoValidators.js';

export const validatePriority = (str: string): Result<Priority, Error> =>
  isPriority(str)
    ? ({ isSuccess: true, data: str } as const)
    : ({ isSuccess: false, error: new Error('「低」「並」「高」のうちいずれかを選んでください') } as const);
