import type { TodoRepositoryError } from '../../../repositories/todo/type.ts';
import type { TodoPersistenceError } from '../types/errors.ts';

export function toTodoPersistenceError(e: TodoRepositoryError): TodoPersistenceError {
  switch (e.type) {
    case 'database-error':
    case 'constraint-violation':
      return { type: 'persistence-error' };
    default:
      return e satisfies never;
  }
}
