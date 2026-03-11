import request from 'supertest';
import { createApp } from '../../src/app';

describe('GET /tasks', () => {
  it('should return empty array when no tasks exist', async () => {
    const app = createApp();

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return all created tasks', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: 'Task 1' });
    await request(app).post('/tasks').send({ title: 'Task 2' });

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toMatchObject({ title: 'Task 1', done: false });
    expect(response.body[1]).toMatchObject({ title: 'Task 2', done: false });
  });

  it('should return tasks matching expected schema', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: 'Schema Task' });

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    const task = response.body[0];
    expect(typeof task.id).toBe('string');
    expect(task.id.length).toBeGreaterThan(0);
    expect(typeof task.title).toBe('string');
    expect(typeof task.done).toBe('boolean');
  });

  it('should not modify task state', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: 'Unchanged Task' });

    await request(app).get('/tasks');
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].done).toBe(false);
  });
});

describe('POST /tasks', () => {
  it('should create a task and return 201', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({ title: 'Created Task' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: 'Created Task', done: false });
    expect(typeof response.body.id).toBe('string');
  });

  it('should return 400 when title is missing', async () => {
    const app = createApp();

    const response = await request(app).post('/tasks').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'title is required' });
  });
});
