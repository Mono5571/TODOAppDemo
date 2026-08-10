import { Hono } from 'hono';

interface TestTodo {
  todo_id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const testTodos: TestTodo[] = [];

export const todosRoute = new Hono();

todosRoute.get('/todos', (c) => c.json({ testTodos }));

todosRoute.post('/todos', async (c) => {
  const { title, dueDate }: { title: unknown; dueDate: unknown } = await c.req.json();

  if (typeof title !== 'string' || typeof dueDate !== 'string') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const newTestTodo = {
    todo_id: testTodos.length + 1,
    title,
    dueDate,
    completed: false
  };
  testTodos.push(newTestTodo);

  return c.json({ testTodos });
});

todosRoute.put('/todos/:todo_id', async (c) => {
  const { todo_id } = c.req.param();
  const { completed }: { completed: unknown } = await c.req.json();

  if (typeof completed !== 'boolean') {
    return c.json({ error: 'invalid request body' }, 400);
  }

  const target = testTodos.find((t) => t.todo_id === Number(todo_id));
  if (!target) {
    return c.notFound();
  }

  target.completed = completed;

  return c.json({ testTodos });
});
