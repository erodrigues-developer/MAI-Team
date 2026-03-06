import { TaskService, ValidationError } from '../../src/services/taskService';
import { ITaskRepository } from '../../src/repositories/ITaskRepository';
import { Task } from '../../src/models/task';
import { CreateTaskDto } from '../../src/models/taskDto';

function makeRepository(overrides?: Partial<ITaskRepository>): ITaskRepository {
  return {
    create: (dto: CreateTaskDto): Task => ({
      id: 'test-uuid',
      title: dto.title,
      done: false,
    }),
    ...overrides,
  };
}

describe('TaskService', () => {
  it('should create a task with id and done=false', () => {
    const service = new TaskService(makeRepository());
    const task = service.createTask({ title: 'Buy milk' });

    expect(task.id).toBe('test-uuid');
    expect(task.title).toBe('Buy milk');
    expect(task.done).toBe(false);
  });

  it('should throw ValidationError when title is empty string', () => {
    const service = new TaskService(makeRepository());
    expect(() => service.createTask({ title: '' })).toThrow(ValidationError);
    expect(() => service.createTask({ title: '' })).toThrow('title cannot be empty');
  });

  it('should throw ValidationError when title is whitespace only', () => {
    const service = new TaskService(makeRepository());
    expect(() => service.createTask({ title: '   ' })).toThrow(ValidationError);
  });

  it('should trim title before storing', () => {
    let captured: CreateTaskDto | undefined;
    const repo = makeRepository({
      create: (dto: CreateTaskDto) => {
        captured = dto;
        return { id: 'uuid', title: dto.title, done: false };
      },
    });
    const service = new TaskService(repo);
    service.createTask({ title: '  Buy milk  ' });
    expect(captured?.title).toBe('Buy milk');
  });
});
