import type { TodoRepositoryError } from '../../../repositories/todo/type.ts';

export function createUnknownError(e: unknown) {
  return { type: 'unknown-error', cause: e } as const;
}
type UnknownError = ReturnType<typeof createUnknownError>;

export const todoPersistenceError = {
  type: 'persistence-error'
} as const;

export type TodoPersistenceError = typeof todoPersistenceError;

export type CreateTodoError =
  | {
      readonly type: 'invalid-task';
    }
  | {
      readonly type: 'invalid-priority';
    }
  | {
      readonly type: 'invalid-deadline';
    }
  | TodoPersistenceError
  | UnknownError;

export type FindTodosError = TodoPersistenceError | UnknownError;

export type UpdateTodoIsDoneError =
  | {
      readonly type: 'invalid-todo-id';
    }
  | {
      readonly type: 'invalid-is-done';
    }
  | {
      readonly type: 'todo-not-found';
    }
  | TodoPersistenceError
  | UnknownError;

export type DeleteTodoError =
  | {
      readonly type: 'invalid-todo-id';
    }
  | {
      readonly type: 'todo-not-found';
    }
  | TodoPersistenceError
  | UnknownError;
