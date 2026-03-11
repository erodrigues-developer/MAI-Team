import { Task } from '../models/task';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(id: string, updates: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}