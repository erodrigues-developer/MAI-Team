import { TaskService } from '../../src/services/taskService';
import { ITaskRepository } from '../../src/repositories/ITaskRepository';
import { Task } from '../../src/models/task';

const makeRepository = (tasks: Task[] = []): jest.Mocked<ITaskRepository> => ({
  findAll: jest.fn().mockReturnValue(tasks),
  create: jest.fn(),
});

describe('TaskService', () => {
  describe('getAllTasks', () => {
    it('should return all tasks from repository', () => {
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', done: false },
        { id: '2', title: 'Task 2', done: false },
      ];
      const repo = makeRepository(tasks);
      const service = new TaskService(repo);

      const result = service.getAllTasks();

      expect(result).toEqual(tasks);
      expect(repo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tasks exist', () => {
      const repo = makeRepository([]);
      const service = new TaskService(repo);

      const result = service.getAllTasks();

      expect(result).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('should delegate to repository and return created task', () => {
      const created: Task = { id: 'abc', title: 'New Task', done: false };
      const repo = makeRepository();
      repo.create.mockReturnValue(created);
      const service = new TaskService(repo);

      const result = service.createTask({ title: 'New Task' });

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith({ title: 'New Task' });
    });
  });
});
