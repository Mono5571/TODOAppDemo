import type { Todo, TodoId } from '@todo/shared';
import type { TodoRepository } from './type.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';
import { deadlineToDate, dateToDeadline, toTask, toTodoId } from './prismaTodoParsers.ts';

function createPrismaTodoRepository(prisma: PrismaClient): TodoRepository {
  return {
    async create(newTodo: Omit<Todo, 'id' | 'isDone'>): Promise<Todo> {
      const created = await prisma.todo.create({
        data: {
          task: newTodo.task,
          priority: newTodo.priority,
          deadline: deadlineToDate(newTodo.deadline)
        }
      });

      return {
        id: toTodoId(created.id),
        task: toTask(created.task),
        priority: created.priority,
        deadline: dateToDeadline(created.deadline),
        isDone: created.isDone
      };
    },

    async findAll(): Promise<Todo[]> {
      const founds = await prisma.todo.findMany();
      return founds.map((found) => ({
        id: toTodoId(found.id),
        task: toTask(found.task),
        priority: found.priority,
        deadline: dateToDeadline(found.deadline),
        isDone: found.isDone
      }));
    },

    async findById(id: TodoId): Promise<Todo | null> {
      const found = await prisma.todo.findUnique({
        where: { id }
      });

      if (found === null) return null;
      return {
        id: toTodoId(found.id),
        task: toTask(found.task),
        priority: found.priority,
        deadline: dateToDeadline(found.deadline),
        isDone: found.isDone
      };
    },

    async updateIsDone(id: TodoId, isDone: boolean): Promise<void | null> {
      const updated = await prisma.todo.update({
        where: { id },
        data: { isDone: isDone }
      });

      if (updated == null) return null;
    },

    async deleteById(id: TodoId): Promise<boolean> {
      const deleted = await prisma.todo.delete({
        where: { id }
      });

      if (deleted == null) return false;
      return true;
    }
  };
}
