const { test, after, before, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const assert = require('assert');
const User = require('../models/user');
const bcrypt = require('bcrypt');

before(async () => {
  await User.deleteMany({});
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User API tests', () => {
  test('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'testuser11',
      name: 'testuser11',
      password: 'securepassword',
    };

    const response = await api.post('/api/users').send(newUser).expect(200);

    assert(response.body.token, 'Token should be returned');
    assert.equal(response.body.username, newUser.username);
  });

  test('POST /api/users fails with short password', async () => {
    const newUser = {
      username: 'testuser',
      name: 'kala',
      password: 'abc',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);

    assert.equal(response.body.error, 'Password must be longer than 3');
  });

  test('POST /api/users fails with duplicate username', async () => {
    const newUser = {
      username: 'testuser11',
      name: 'kala',
      password: 'ab456c',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);

    assert.equal(response.body.error, 'Username must be unique');
  });

  test('GET /api/users returns all users', async () => {
    const newUser = {
      username: 'testu123ser',
      password: 'ab3213c',
      name: 'simo',
    };
    await api.post('/api/users').send(newUser).expect(200);
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.equal(response.body.length, 3);
  });
});
