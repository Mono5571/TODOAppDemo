import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.ts';
import { todosRoute } from './routes/todos/index.ts';
import { PORT_CLIENT } from './config/env.ts';

const app = new Hono();

// CORS 設定
app.use(
  cors({
    origin: [`http:localhost:${PORT_CLIENT}`],
    // allowHeaders: ['Content-Type']
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.route('/', healthRoute);
app.route('/', todosRoute);

export default app;
