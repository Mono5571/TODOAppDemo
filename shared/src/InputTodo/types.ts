import type { Todo } from '../Todo/types.js';
import type { AtLeastOne } from '../types/atLeastOne.js';
import type { inputKeyList } from './constants.js';

export type InputTodoKey = (typeof inputKeyList)[number];

export type InputValues = { [key in InputTodoKey]: string };

export type InputTodo = Pick<Readonly<Todo>, InputTodoKey>;

export type UpdateTodo = AtLeastOne<Todo>;
