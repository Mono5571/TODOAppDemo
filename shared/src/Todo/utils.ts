import { isElement } from '../utils/isElement.js';
import { priorityList } from './constants.js';
import type { Priority } from './types.js';

export const isPriority = (str: string): str is Priority => isElement<string, Priority>(str, priorityList);
