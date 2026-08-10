import { Hono } from 'hono';
import { healthRoute } from './routes/health.ts';
import { todosRoute } from './routes/todos.ts';

const app = new Hono();

app.route('/', healthRoute);
app.route('/', todosRoute);

export default app;
