import express, { Application } from 'express';
import { InMemoryTaskRepository } from './repositories/inMemoryTaskRepository';
import { TaskService } from './services/taskService';
import { TaskController } from './controllers/taskController';
import { createTaskRouter } from './routes/taskRoutes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);
  const controller = new TaskController(service);

  const app = express();
  app.use(express.json());
  app.use(requestLogger);
  app.use('/tasks', createTaskRouter(controller));
  app.use(errorHandler);

  return app;
}

export default createApp();
