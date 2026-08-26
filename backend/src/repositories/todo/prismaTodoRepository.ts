import type { Todo } from '@todo/shared';
import type { TodoRepository } from './type.ts';

/*
class PrismaTodoRepository implements TodoRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create = async (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
    // id, isDone: false は Repository が持つべき知識ではない
    return this.prisma.todo.create({
      data: newTodo
    });
  };
}
*/
