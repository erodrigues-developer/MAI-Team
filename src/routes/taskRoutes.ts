import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { TaskService } from '../services/taskService';
import { InMemoryTaskRepository } from '../repositories/inMemoryTaskRepository';

const router = Router();

// Create dependencies (in a real app, this might be done with DI container)
const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

// Define routes
router.post('/tasks', (req, res) => taskController.createTask(req, res));
router.get('/tasks', (req, res) => taskController.getAllTasks(req, res));
router.get('/tasks/:id', (req, res) => taskController.getTask(req, res));
router.put('/tasks/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res));

export default router;