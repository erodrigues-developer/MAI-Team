import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();

describe('POST /tasks', () => {
  it('should create a task and return 201 with id and done=false', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Buy milk' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(typeof res.body.id).toBe('string');
    expect(res.body.title).toBe('Buy milk');
    expect(res.body.done).toBe(false);
  });

  it('should return 400 when title is empty', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 when title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({})
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should generate a unique id for each task', async () => {
    const res1 = await request(app)
      .post('/tasks')
      .send({ title: 'Task 1' })
      .set('Content-Type', 'application/json');

    const res2 = await request(app)
      .post('/tasks')
      .send({ title: 'Task 2' })
      .set('Content-Type', 'application/json');

    expect(res1.body.id).not.toBe(res2.body.id);
  });
});
