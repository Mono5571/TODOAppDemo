import { Prisma } from '../../../generated/prisma/client.ts';
import type { TodoRepositoryError } from '../type.ts';

/**
 * try catch syntax の catch (e) 以下で使用する
 *
 * - Prisma から渡ってきた既知のリクエストエラーで、エラーコードがデータベースの制約違反を表すなら、その情報を含むオブジェクトを返す
 * - それ以外の場合、データベースエラーであることを示すオブジェクトを返す
 * @param e try ... catch で catch する
 * @returns
 */
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
