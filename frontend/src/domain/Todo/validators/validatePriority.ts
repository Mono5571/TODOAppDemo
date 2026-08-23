import { priorityList } from '@todo/shared';
import type { Priority, Result } from '@todo/shared';
import { isElement } from '../../../utils/utils.js';

const isPriority = (str: string): str is Priority => isElement<string, Priority>(str, priorityList);

export const validatePriority = (str: string): Result<Priority, Error> =>
  isPriority(str)
    ? ({ ok: true, data: str } as const)
    : ({ ok: false, err: new Error('「低」「並」「高」のうちいずれかを選んでください') } as const);
