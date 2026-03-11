import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  listTasks = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const tasks = this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  createTask = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { title } = req.body as { title?: unknown };
      if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'title is required' });
        return;
      }
      const task = this.taskService.createTask({ title: title.trim() });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };
}
