import type { Priority, Result } from '@todo/shared';
import { isPriority } from '@todo/shared';

export const validatePriority = (str: string): Result<Priority, Error> =>
  isPriority(str)
    ? ({ ok: true, data: str } as const)
    : ({ ok: false, err: new Error('「低」「並」「高」のうちいずれかを選んでください') } as const);
