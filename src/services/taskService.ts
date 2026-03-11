import { randomUUID } from 'crypto';
import { Task } from '../models/task';
import { CreateTaskDto, UpdateTaskDto } from '../models/taskDto';
import { ITaskRepository } from '../repositories/ITaskRepository';

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Validate title is not empty
    if (!createTaskDto.title || createTaskDto.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    // Create new task
    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title.trim(),
      done: false
    };

    return await this.taskRepository.create(task);
  }

  async getTask(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    // Check if task exists
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }

    // Validate title if provided
    if (updateTaskDto.title !== undefined && updateTaskDto.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    // Clean up title if provided
    const updates: Partial<Task> = {};
    if (updateTaskDto.title !== undefined) {
      updates.title = updateTaskDto.title.trim();
    }
    if (updateTaskDto.done !== undefined) {
      updates.done = updateTaskDto.done;
    }

    return await this.taskRepository.update(id, updates);
  }

  async deleteTask(id: string): Promise<boolean> {
    return await this.taskRepository.delete(id);
  }
}