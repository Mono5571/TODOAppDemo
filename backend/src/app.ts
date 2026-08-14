import { Hono } from 'hono';
import { healthRoute } from './routes/health.ts';
import { todosRoute } from './routes/todos/index.ts';

const app = new Hono();

app.route('/', healthRoute);
app.route('/', todosRoute);

export default app;
