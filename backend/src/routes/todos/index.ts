import { Hono } from 'hono';
import { priorityList } from '@todo/shared';
import type {
  TodoId,
  ValidTask,
  Priority,
  ValidDeadline,
  Todo,
  FindAllTodosResponse,
  CreateTodoResponse,
  RemoveAllTodoResponse
} from '@todo/shared';
import { createTodos } from './createTodos.ts';
import { validateDeadline, validateTask } from './validator.ts';
import { generateTodoId } from './generateTodoId.ts';

const todos = createTodos([]);

export const todosRoute = new Hono();

todosRoute.get('/todos', (c) => c.json(todos.list satisfies FindAllTodosResponse));

todosRoute.post('/todos', async (c) => {
  const { task, priority, deadline }: { task: unknown; priority: unknown; deadline: unknown } = await c.req.json();

  if (typeof task !== 'string' || typeof priority !== 'string' || typeof deadline !== 'string') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const idResult = generateTodoId();
  if (!idResult.ok) {
    return c.json({ error: idResult.err }, 400);
  }

  const taskResult = validateTask(task);
  if (!taskResult.ok) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  if (!priorityList.some((p) => p === priority)) return c.json({ error: 'invalid request body' }, 400);

  const deadlineResult = validateDeadline(deadline);
  if (!deadlineResult.ok) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const newTodo: Todo = {
    id: idResult.data,
    task: taskResult.data,
    priority: priority as Priority,
    deadline: deadlineResult.data,
    isDone: false
  };
  todos.add(newTodo);

  return c.json(newTodo satisfies CreateTodoResponse);
});

todosRoute.patch('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { isDone }: { isDone: unknown } = await c.req.json();

  if (typeof isDone !== 'boolean') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) return c.json({ error: 'invalid request body' }, 400);

  if (!todos.hasId(idNum as TodoId)) {
    return c.notFound();
  }

  todos.update(idNum as TodoId, isDone);

  return c.json({ success: true });
});

todosRoute.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();

  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) return c.json({ error: 'invalid request body' }, 400);

  if (!todos.hasId(idNum as TodoId)) {
    return c.notFound();
  }

  todos.remove(idNum as TodoId);

  return c.json({ success: true });
});

todosRoute.put('/todos', async (c) => {
  const { ids }: { ids: unknown } = await c.req.json();

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => typeof id !== 'number' || todos.hasId(id as TodoId))
  ) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  ids.forEach((id) => {
    todos.remove(id);
  });

  return c.json(todos.list satisfies RemoveAllTodoResponse);
});
