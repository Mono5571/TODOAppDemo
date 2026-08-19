import { Hono, type TypedResponse } from 'hono';
import { priorityList } from '@todo/shared';
import type {
  TodoId,
  ValidTask,
  Priority,
  ValidDeadline,
  Todo,
  FindAllTodosResponse,
  CreateTodoResponse
} from '@todo/shared';
import { createTodos } from './createTodos.ts';
import { isTodoId, validateDeadline, validateTask } from './validator.ts';
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

  if (!isTodoId(id)) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  if (!todos.hasId(id)) {
    return c.notFound();
  }

  todos.update(id, isDone);

  return c.json(todos.list);
});

// PUT メソッドで複数まとめて削除する方向に改善する
todosRoute.delete('/todos/:id', async (c) => {
  const { id } = c.req.param();

  if (!isTodoId(id)) {
    return c.json({ error: 'invalid request body' }, 400);
  }

  if (!todos.hasId(id)) {
    return c.notFound();
  }

  todos.remove(id);

  return c.json(todos.list);
});
