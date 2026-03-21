import { TaskService } from '../../src/services/taskService';
import { ITaskRepository } from '../../src/repositories/ITaskRepository';
import { Task } from '../../src/models/task';
import { CreateTaskDto } from '../../src/models/taskDto';

// Mock repository
const mockRepository: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService(mockRepository);
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully with valid input', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: 'Test Task' };
      const expectedTask: Task = {
        id: expect.any(String),
        title: 'Test Task',
        done: false
      };

      mockRepository.create.mockResolvedValue(expectedTask);

      // Act
      const result = await taskService.createTask(createTaskDto);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'Test Task',
          done: false
        })
      );
      expect(result).toEqual(expectedTask);
    });

    it('should trim whitespace from title', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: '  Test Task  ' };
      const expectedTask: Task = {
        id: expect.any(String),
        title: 'Test Task',
        done: false
      };

      mockRepository.create.mockResolvedValue(expectedTask);

      // Act
      await taskService.createTask(createTaskDto);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task'
        })
      );
    });

    it('should throw error when title is empty', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: '' };

      // Act & Assert
      await expect(taskService.createTask(createTaskDto)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when title is only whitespace', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: '   ' };

      // Act & Assert
      await expect(taskService.createTask(createTaskDto)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when title is undefined', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: undefined as any };

      // Act & Assert
      await expect(taskService.createTask(createTaskDto)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should generate a UUID for the task', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: 'Test Task' };

      mockRepository.create.mockImplementation(async (task) => task);

      // Act
      const result = await taskService.createTask(createTaskDto);

      // Assert
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should set done to false for new tasks', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = { title: 'Test Task' };

      mockRepository.create.mockImplementation(async (task) => task);

      // Act
      const result = await taskService.createTask(createTaskDto);

      // Assert
      expect(result.done).toBe(false);
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await taskService.getAllTasks();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should return all tasks from repository', async () => {
      const tasks: Task[] = [
        { id: 'uuid-1', title: 'Task One', done: false },
        { id: 'uuid-2', title: 'Task Two', done: true },
      ];
      mockRepository.findAll.mockResolvedValue(tasks);

      const result = await taskService.getAllTasks();

      expect(result).toEqual(tasks);
    });
  });
});