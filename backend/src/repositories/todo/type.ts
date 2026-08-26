import type { InputTodo, Todo, TodoId } from '@todo/shared';

export interface TodoRepository {
  create(newTodo: Omit<Todo, 'id'>): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findById(id: TodoId): Promise<Todo | null>;
  updateIsDone(id: TodoId, isDone: boolean): Promise<void | null>;
  deleteById(id: TodoId): Promise<boolean>;
}
