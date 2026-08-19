import type { ValidTask, Priority, ValidDeadline, AtLeastOne, Todo } from '@todo/shared';

export const inputKeyList = ['task', 'priority', 'deadline'] as const;
export type InputKey = (typeof inputKeyList)[number];

export type InputValues = { [key in InputKey]: string };

export type InputTodo = Pick<Readonly<Todo>, InputKey>;

export type UpdateTodo = AtLeastOne<Todo>;
