import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.ts';
import { todosRoute } from './routes/todos/index.ts';
import { CORS_ORIGIN } from './config/env.ts';

const app = new Hono();

// CORS 設定
app.use(
  cors({
    origin: [CORS_ORIGIN],
    // allowHeaders: ['Content-Type']
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  })
);

app.route('/', healthRoute);
app.route('/', todosRoute);

export default app;
