import { Prisma } from '../../../generated/prisma/client.ts';
import type { TodoRepositoryError } from '../type.ts';

export function toRepositoryError(e: unknown): TodoRepositoryError {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002': // "Unique constraint failed on the {constraint}"
      case 'P2003': // "Foreign key constraint failed on the field: {field_name}"
      case 'P2004': // "A constraint failed on the database: {database_error}"
      case 'P2011': // "Null constraint violation on the {constraint}"
        return {
          type: 'constraint-violation',
          constraint: String(e.meta?.['constraint'] ?? 'unknown')
        };
    }
  }

  return {
    type: 'database-error',
    cause: e
  };
}
