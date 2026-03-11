import { Task } from '../models/task';
import { CreateTaskDto } from '../models/taskDto';
import { ITaskRepository } from '../repositories/ITaskRepository';

export class TaskService {
  constructor(private readonly repository: ITaskRepository) {}

  getAllTasks(): Task[] {
    return this.repository.findAll();
  }

  createTask(dto: CreateTaskDto): Task {
    return this.repository.create(dto);
  }
}
