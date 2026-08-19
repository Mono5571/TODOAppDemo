import type { InputTodo } from '../../types/inputs.js';
import type { Todo, TodoId } from '@todo/shared';

export function createTodo({
  id,
  validData,
  isDone = false
}: {
  id: TodoId;
  validData: InputTodo;
  isDone?: boolean;
}): Todo {
  const todo = { id, ...validData, isDone };
  return todo;
}
