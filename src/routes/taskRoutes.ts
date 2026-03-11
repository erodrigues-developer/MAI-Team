import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();
  router.get('/', controller.listTasks);
  router.post('/', controller.createTask);
  return router;
}
