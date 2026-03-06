import { Task } from '../models/task';
import { CreateTaskDto } from '../models/taskDto';
import { ITaskRepository } from './ITaskRepository';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      done: false,
    };
    this.tasks.push(task);
    return task;
  }
}
