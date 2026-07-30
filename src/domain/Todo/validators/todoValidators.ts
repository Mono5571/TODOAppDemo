import type { Priority, TodoKey } from '../types.js';
import { priorityList, todoKeyList } from '../types.js';
import { isElement } from '../../../utils/utils.js';

export const isPriority = (str: string): str is Priority => isElement<Priority>(str, priorityList);

export const isTodoKey = (str: string): str is TodoKey => isElement<TodoKey>(str, todoKeyList);
