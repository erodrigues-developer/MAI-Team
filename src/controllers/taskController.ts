import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskDto, UpdateTaskDto } from '../models/taskDto';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const createTaskDto: CreateTaskDto = {
        title: req.body.title
      };

      const task = await this.taskService.createTask(createTaskDto);

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error && error.message === 'Title cannot be empty') {
        res.status(400).json({ error: 'Title cannot be empty' });
        return;
      }

      // Log error for debugging but don't expose stack trace
      console.error('[ERROR]', new Date().toISOString(), 'Error creating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTask(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('[ERROR]', new Date().toISOString(), 'Error getting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('[ERROR]', new Date().toISOString(), 'Error getting all tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateTaskDto: UpdateTaskDto = {
        title: req.body.title,
        done: req.body.done
      };

      const task = await this.taskService.updateTask(id, updateTaskDto);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      if (error instanceof Error && error.message === 'Title cannot be empty') {
        res.status(400).json({ error: 'Title cannot be empty' });
        return;
      }

      console.error('[ERROR]', new Date().toISOString(), 'Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.taskService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('[ERROR]', new Date().toISOString(), 'Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}