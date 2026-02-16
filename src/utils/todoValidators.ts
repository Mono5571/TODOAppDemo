import type { Priority, TodoKey, ValidDeadline, Todo } from '../types/todo.js';
import { priorityList, todoKeyList } from '../types/todo.js';
import { isElement } from './utils.js';

export const isPriority = (str: string): str is Priority => isElement<Priority>(str, priorityList);

export const isTodoKey = (str: string): str is TodoKey => isElement<TodoKey>(str, todoKeyList);
