import request from 'supertest';
import app from '../../src/app';

describe('GET /tasks', () => {
  it('should return an empty array when no tasks exist', async () => {
    const response = await request(app)
      .get('/tasks')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return created tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Task One' }).expect(201);
    await request(app).post('/tasks').send({ title: 'Task Two' }).expect(201);

    const response = await request(app)
      .get('/tasks')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(2);
    const titles = response.body.map((t: { title: string }) => t.title);
    expect(titles).toContain('Task One');
    expect(titles).toContain('Task Two');
  });

  it('should return tasks matching the expected schema', async () => {
    const response = await request(app)
      .get('/tasks')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    for (const task of response.body) {
      expect(task).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        done: expect.any(Boolean),
      });
      expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    }
  });
});

describe('POST /tasks', () => {
  it('should create a task successfully with valid input', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' })
      .expect('Content-Type', /json/)
      .expect(201);

    // Assert
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'Test Task',
      done: false
    });

    // Verify ID is a valid UUID
    expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should trim whitespace from title', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({ title: '  Test Task  ' })
      .expect(201);

    // Assert
    expect(response.body.title).toBe('Test Task');
  });

  it('should return 400 error when title is empty', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({ title: '' })
      .expect('Content-Type', /json/)
      .expect(400);

    // Assert
    expect(response.body).toEqual({
      error: 'Title cannot be empty'
    });
  });

  it('should return 400 error when title is only whitespace', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({ title: '   ' })
      .expect('Content-Type', /json/)
      .expect(400);

    // Assert
    expect(response.body).toEqual({
      error: 'Title cannot be empty'
    });
  });

  it('should return 400 error when title is missing', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);

    // Assert
    expect(response.body).toEqual({
      error: 'Title cannot be empty'
    });
  });

  it('should return 400 error when title is null', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({ title: null })
      .expect('Content-Type', /json/)
      .expect(400);

    // Assert
    expect(response.body).toEqual({
      error: 'Title cannot be empty'
    });
  });

  it('should ignore unknown fields in request body', async () => {
    // Act
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        unknownField: 'should be ignored',
        anotherField: 123
      })
      .expect(201);

    // Assert
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'Test Task',
      done: false
    });
    expect(response.body).not.toHaveProperty('unknownField');
    expect(response.body).not.toHaveProperty('anotherField');
  });

});