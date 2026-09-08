import type { Result, Todo, InputTodo, TodoId } from '@todo/shared';
import type { TodoRepository, TodoRepositoryError } from './type.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';
import { deadlineToDate, toDomainTodo } from './parsers.ts';
import { isRecordNotFoundError } from './errors/isRecordNotFoundError.ts';
import { toRepositoryError } from './errors/toRepositoryError.ts';

function createPrismaTodoRepository(prisma: PrismaClient): TodoRepository {
  return {
    async create(newTodo: InputTodo): Promise<Result<Todo, TodoRepositoryError>> {
      try {
        const created = await prisma.todo.create({
          data: {
            task: newTodo.task,
            priority: newTodo.priority,
            deadline: deadlineToDate(newTodo.deadline)
          }
        });

        return {
          ok: true,
          data: toDomainTodo(created)
        };
      } catch (e) {
        return { ok: false, err: toRepositoryError(e) };
      }
    },

    async findAll(): Promise<Result<Todo[], TodoRepositoryError>> {
      try {
        const founds = await prisma.todo.findMany();
        return { ok: true, data: founds.map((found) => toDomainTodo(found)) };
      } catch (e) {
        return { ok: false, err: toRepositoryError(e) };
      }
    },

    async findById(id: TodoId): Promise<Result<Todo | null, TodoRepositoryError>> {
      try {
        const found = await prisma.todo.findUnique({
          where: { id }
        });

        return { ok: true, data: found === null ? null : toDomainTodo(found) };
      } catch (e) {
        return { ok: false, err: toRepositoryError(e) };
      }
    },

    async updateIsDone(id: TodoId, isDone: boolean): Promise<Result<Todo | null, TodoRepositoryError>> {
      try {
        const updated = await prisma.todo.update({
          where: { id },
          data: { isDone: isDone }
        });

        return { ok: true, data: toDomainTodo(updated) };
      } catch (e) {
        if (isRecordNotFoundError(e)) return { ok: true, data: null };
        return { ok: false, err: toRepositoryError(e) };
      }
    },

    async deleteById(id: TodoId): Promise<Result<boolean, TodoRepositoryError>> {
      try {
        await prisma.todo.delete({
          where: { id }
        });

        return { ok: true, data: true };
      } catch (e) {
        if (isRecordNotFoundError(e)) return { ok: true, data: false };
        return { ok: false, err: toRepositoryError(e) };
      }
    }
  };
}
