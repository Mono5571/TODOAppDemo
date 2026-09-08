import type { Todo, TodoKey } from '../Todo/types.js';
import type { AtLeastOne } from '../types/atLeastOne.js';

export type InputTodoKey = Exclude<TodoKey, 'id' | 'isDone'>;

export type InputValues = { [key in InputTodoKey]: string };

export type InputTodo = Pick<Readonly<Todo>, InputTodoKey>;

export type UpdateTodo = AtLeastOne<Todo>;
