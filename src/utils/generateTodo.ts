import type { ValidInputs } from '../types/inputs.js';
import type { Todo, TodoId } from '../types/todo.js';

export function generateTodo({
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
