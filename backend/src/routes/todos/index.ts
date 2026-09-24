import { Hono } from 'hono';
import type { FindAllTodosResponse, CreateTodoResponse, RemoveAllTodoResponse } from '@todo/shared';
import { findTodos } from '../../services/todos/findTodos.ts';
import { createPrismaTodoRepository } from '../../repositories/todo/prismaTodoRepository.ts';
import { PrismaClient } from '../../generated/prisma/client.ts';
import { createTodo } from '../../services/todos/createTodo.ts';
import { updateTodoIsDone } from '../../services/todos/updateTodoIsDone.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { deleteTodo } from '../../services/todos/deleteTodo.ts';
import { isNumberArray } from '../../utils/isNumberArray.ts';
import { deleteTodosMany } from '../../services/todos/deleteTodosMany.ts';

// 別の箇所に移すべきコード
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: `${process.env['DATABASE_URL']}` })
});
const repository = createPrismaTodoRepository(prisma);

export const todosRoute = new Hono();

todosRoute.get('/todos', async (c) => {
  const result = await findTodos(repository);
  if (!result.ok) {
    return c.json({ error: 'internal error' }, 500);
  }

  return c.json(result.data satisfies FindAllTodosResponse);
});

todosRoute.post('/todos', async (c) => {
  const { task, priority, deadline }: { task: unknown; priority: unknown; deadline: unknown } = await c.req.json();

  if (task == null || priority == null || deadline == null) {
    return c.json({ error: 'invalid request body' }, 400);
  }
  if (typeof task !== 'string' || typeof priority !== 'string' || typeof deadline !== 'string') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const result = await createTodo({ task, priority, deadline }, repository);

  if (!result.ok) return c.json({ error: 'internal error' }, 500);

  return c.json(result.data satisfies CreateTodoResponse);
});

todosRoute.patch('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { isDone }: { isDone: unknown } = await c.req.json();

  if (id == null) return c.json({ error: 'invalid request body' }, 400);
  if (id === '') return c.json({ error: 'invalid request body' }, 400);

  if (isDone == null) return c.json({ error: 'invalid request body' }, 400);
  if (typeof isDone !== 'boolean') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const result = await updateTodoIsDone({ id: parseInt(id, 10), isDone }, repository);

  if (!result.ok) return c.json({ error: 'internal error' }, 500);

  return c.json({ success: true });
});

todosRoute.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();

  if (id == null) return c.json({ error: 'invalid request body' }, 400);
  if (id === '') return c.json({ error: 'invalid request body' }, 400);

  const result = await deleteTodo(parseInt(id, 10), repository);
  if (!result.ok) {
    return result.err.type === 'todo-not-found' ? c.notFound() : c.json({ error: 'internal error' }, 500);
  }

  return c.json({ success: true });
});

todosRoute.put('/todos', async (c) => {
  const { ids }: { ids: unknown } = await c.req.json();

  if (ids == null || !Array.isArray(ids) || ids.length === 0) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  if (!isNumberArray(ids)) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const deleteManyResult = await deleteTodosMany(ids, repository);
  if (!deleteManyResult.ok) {
    return deleteManyResult.err.type === 'todo-not-found' ? c.notFound() : c.json({ error: 'internal error' });
  }

  const findResult = await findTodos(repository);
  if (!findResult.ok) return c.json({ error: 'internal error' }, 500);

  return c.json(findResult.data satisfies RemoveAllTodoResponse);
});
