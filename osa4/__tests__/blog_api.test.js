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

let userToken;

before(async () => {
  await Blog.deleteMany({});
  await seedDatabase();
  const user = { username: 'test', password: 'test233', name: 'kari' };
  await api.post('/api/users').send(user);

  const login = await api.post('/api/login').send(user);

  userToken = login.body.token;
});

after(async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

describe('Get and POST tests', () => {
  test('notes are returned as json and length is 1', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(response.body.length, 1);
  });

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

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
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
      .set('Authorization', `Bearer ${userToken}`)
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
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        author: 'Test Author',
        likes: 69,
      })
      .expect(400);
  });

  test('POST /api/blogs without authorization fails with 401 Unauthorized', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Some Author',
      url: 'http://unauthorized.com',
      likes: 5,
    };

    const response = await api.post('/api/blogs').send(newBlog).expect(401);

    assert.equal(response.body.error, 'token missing');
  });
});

describe('Testing delete functionalities', () => {
  test('Testing delete', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'New Blog',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 69,
      });
    const response = await api.get('/api/blogs');
    const blogId = response.body[1].id;

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204);

    const deletedBlog = await api.get('/api/blogs');
    assert.notStrictEqual(deletedBlog.body[1].id, blogId);
  });
  test('test delete without id', async () => {
    await api
      .delete(`/api/blogs/`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});

describe('Testing PUT functionalities', () => {
  test('Testing PUT', async () => {
    const response = await api.get('/api/blogs');
    const blogId = response.body[0].id;
    const likesAmountBefore = response.body[0].likes;
    const responseUpdate = await api
      .put(`/api/blogs/${blogId}`)
      .send({
        title: 'New Blog1',
        author: 'Test Author',
        url: 'http://example.com',
        likes: likesAmountBefore + 1,
      })
      .expect(200);

    assert.strictEqual(
      responseUpdate.body.message,
      'Blog updated successfully'
    );

    const updatedBlog = await api.get('/api/blogs');
    assert.strictEqual(updatedBlog.body[0].likes, likesAmountBefore + 1);
  });
  test('test PUT without id', async () => {
    await api
      .delete(`/api/blogs/`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});

after(async () => {
  await mongoose.connection.close();
});
