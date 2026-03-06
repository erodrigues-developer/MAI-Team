import { Task } from '../models/task';
import { CreateTaskDto } from '../models/taskDto';
import { ITaskRepository } from '../repositories/ITaskRepository';

export class TaskService {
  constructor(private readonly repository: ITaskRepository) {}

  createTask(dto: CreateTaskDto): Task {
    if (!dto.title || dto.title.trim() === '') {
      throw new ValidationError('title cannot be empty');
    }
    return this.repository.create({ title: dto.title.trim() });
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
