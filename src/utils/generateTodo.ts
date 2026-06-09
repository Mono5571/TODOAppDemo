import type { ValidInputs } from '../types/inputs';
import type { Todo } from '../types/todo';
import { generateTodoId } from './generateTodoId';

export function generateTodo(validData: ValidInputs): Todo {
  const todo = { ...validData, id: generateTodoId(), isDone: false };
  return todo;
}
