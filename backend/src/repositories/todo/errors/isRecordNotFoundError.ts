import { Prisma } from '../../../generated/prisma/client.ts';

export function isRecordNotFoundError(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}
