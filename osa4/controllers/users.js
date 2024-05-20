const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body;

  if (password.length <= 3) {
    return response
      .status(400)
      .json({ error: 'Password must be longer than 3' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: passwordHash,
      name,
    });
    const savedUser = await user.save();

    const token = jwt.sign(
      { username: savedUser.username, id: savedUser._id },
      process.env.SECRET,
      { expiresIn: 60 * 60 }
    );

    response
      .status(200)
      .send({ token, username: savedUser.username, name: savedUser.name });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find();
    response.json(users);
  } catch (exp) {
    next(exp);
  }
});

module.exports = usersRouter;
