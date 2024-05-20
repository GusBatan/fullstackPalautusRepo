const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find().populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const result = await blog.save();
    response.status(201).json(result);
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const response = await Blog.findOneAndDelete({ _id: id });
    if (!response) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully', response });
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { likes } = req.body;
    const id = req.params.id;
    console.log('id on:', id);
    const response = await Blog.findOneAndUpdate(
      { _id: id },
      { likes },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!response) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog updated successfully', response });
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
