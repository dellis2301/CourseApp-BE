const request = require('supertest');
const app = require('../server');

describe('Course API', () => {
  it('should return an array of courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        title: 'Test Course',
        description: 'Jest test course',
        subject: 'Test',
        credits: 3,
        teacher: 'Test Teacher'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Course');
  });
});
