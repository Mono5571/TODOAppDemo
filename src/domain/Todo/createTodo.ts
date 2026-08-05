import type { ValidInputs } from '../../types/inputs.js';
import type { Todo, TodoId } from './types.js';

export function createTodo({
  id,
  validData,
  isDone = false
}: {
  id: TodoId;
  validData: ValidInputs;
  isDone?: boolean;
}): Todo {
  const todo = { id, ...validData, isDone };
  return todo;
}
