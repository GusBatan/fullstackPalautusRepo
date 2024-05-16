const { test, after, before, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const assert = require('assert');
const Blog = require('../models/blog');

const seedDatabase = async () => {
  await Blog.create({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 10,
  });
};

// Before running tests, seed the database with a blog
before(async () => {
  await seedDatabase();
});

// After running tests, clean up the database
after(async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

test('notes are returned as json and length is 1', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  assert.strictEqual(response.body.length, 1);
});

describe('Get and POST tests', () => {
  test('Returned blogs array objects id field is named id, not _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    response.body.forEach((blog) => {
      assert.strictEqual(blog._id, undefined);
      assert.strictEqual(typeof blog.id, 'string');
    });
  });

  test('You are able to POST to /api/blogs and GET /api/blogs response increases by one', async () => {
    const initialResponse = await api.get('/api/blogs');
    const initialLength = initialResponse.body.length;

    await api.post('/api/blogs').send({
      title: 'New Blog',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 69,
    });

    const finalResponse = await api.get('/api/blogs');
    const finalLength = finalResponse.body.length;
    assert.strictEqual(finalLength, initialLength + 1);
  });

  test('If likes object is null or undefined, its set to 0', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'New Blog1',
        author: 'Test Author',
        url: 'http://example.com',
      })
      .expect(201);
    const response = await api.get('/api/blogs');
    const likes = response.body.map((blog) => blog.likes);

    likes.forEach((like) => assert.strictEqual(typeof like, typeof 0));
  });

  test('If no title or url, answer with 400', async () => {
    await api
      .post('/api/blogs')
      .send({
        author: 'Test Author',
        likes: 69,
      })
      .expect(400);
  });
});

describe('Testing delete functionalities', () => {
  test('Testing delete', async () => {
    const response = await api.get('/api/blogs');
    console.log(response.body[0].id);
  });
});

after(async () => {
  await mongoose.connection.close();
});
