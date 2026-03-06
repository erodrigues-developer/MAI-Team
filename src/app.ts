import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { createTaskRouter } from './routes/taskRoutes';
import { TaskController } from './controllers/taskController';
import { TaskService } from './services/taskService';
import { InMemoryTaskRepository } from './repositories/inMemoryTaskRepository';

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);
  const controller = new TaskController(service);

  app.use('/tasks', createTaskRouter(controller));

  app.use(errorHandler);

  return app;
}
