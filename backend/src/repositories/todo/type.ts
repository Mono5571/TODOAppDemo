import type { InputTodo, Result, Todo, TodoId } from '@todo/shared';

export interface TodoRepository {
  create(newTodo: InputTodo): Promise<Result<Todo, TodoRepositoryError>>;
  findAll(): Promise<Result<Todo[], TodoRepositoryError>>;
  findById(id: TodoId): Promise<Result<Todo | null, TodoRepositoryError>>;
  updateIsDone(id: TodoId, isDone: boolean): Promise<Result<Todo | null, TodoRepositoryError>>;
  deleteById(id: TodoId): Promise<Result<boolean, TodoRepositoryError>>;
}

export type TodoRepositoryError =
  | {
      type: 'database-error';
      cause: unknown;
    }
  | {
      type: 'constraint-violation';
      constraint: string;
    };
