import { Task } from '../models/task';
import { CreateTaskDto } from '../models/taskDto';

export interface ITaskRepository {
  create(dto: CreateTaskDto): Task;
}
