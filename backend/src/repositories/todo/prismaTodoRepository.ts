import type { Todo, TodoId } from '@todo/shared';
import type { TodoRepository } from './type.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';

/*
// class で書くのはどうなのか？
class PrismaTodoRepository implements TodoRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(newTodo: Omit<Todo, 'id'>): Promise<Todo> {
    // id, isDone: false は Repository が持つべき知識ではない
    return await this.prisma.todo.create({
      data: newTodo
    });
  }

  async findAll(): Promise<Todo[]> {
    return await this.prisma.todo.findMany();
  }

  async findById(id: TodoId): Promise<Todo | null> {
    return await this.prisma.todo.findFirst({
      where: { id: parseInt(id, 10) }
    });
  }

  async updateIsDone(id: TodoId, isDone: boolean): Promise<void | null> {
    return await this.prisma.todo.update({
      where: { id: parseInt(id, 10) },
      data: { isDone: isDone }
    });
  }

  async deleteById(id: TodoId): Promise<boolean> {
    const deleted = await this.prisma.todo.delete({
      where: { id: parseInt(id, 10) }
    });

    if (!deleted) return false;
    return true;
  }
}
*/
