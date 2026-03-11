import { Task } from '../models/task';
import { CreateTaskDto } from '../models/taskDto';

export interface ITaskRepository {
  findAll(): Task[];
  create(dto: CreateTaskDto): Task;
}
