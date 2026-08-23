import { serve } from '@hono/node-server';
import app from './app.ts';
import { PORT } from './config/env.ts';

serve(
  {
    fetch: app.fetch,
    port: PORT
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
