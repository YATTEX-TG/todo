import { config } from 'dotenv';
import express from 'express';

import categoriesRouter from './routes/categories.router';
import healthRouter from './routes/health.router';
import todosRouter from './routes/todos.router';

config();

export function buildApp() {
  const app = express();
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/todos', todosRouter);
  app.use('/api/categories', categoriesRouter);

  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

  app.use((err: unknown, _req: express.Request, res: express.Response) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}
