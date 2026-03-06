import { Request, Response, NextFunction } from 'express';
import { TaskService, ValidationError } from '../services/taskService';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  createTask = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = this.taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
        return;
      }
      next(err);
    }
  };
}
