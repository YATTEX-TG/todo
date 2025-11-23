import { config } from 'dotenv';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import categoriesRouter from './routes/categories.router';
import healthRouter from './routes/health.router';
import todosRouter from './routes/todos.router';
import swaggerOptions from './config/swagger';

config();

export function buildApp() {
  const app = express();

  // Swagger documentation
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Middleware
  app.use(express.json({ type: 'application/json' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/health', healthRouter);
  app.use('/api/todos', todosRouter);
  app.use('/api/categories', categoriesRouter);

  // 404 handler
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

  // Error handler
  app.use((err: unknown, _req: express.Request, res: express.Response) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}
