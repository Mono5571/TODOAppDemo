import { Hono } from 'hono';
import { healthRoute } from './routes/health.ts';

const app = new Hono();

app.route('/', healthRoute);
export default app;
