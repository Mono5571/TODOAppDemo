import type { ValidInputs } from '../../types/inputs.js';
import type { Todo, TodoId } from './types.js';

export function createTodo({
  validData,
  id,
  isDone = false
}: {
  validData: ValidInputs;
  id: TodoId;
  isDone?: boolean;
}): Todo {
  const todo = { ...validData, id, isDone };
  return todo;
}
