const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'No username or password' });
  }

  if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Username or password too short' });
  }

  try {
    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name, id: user._id });
  } catch (e) {
    next(e);
  }
});

module.exports = loginRouter;
