const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find().populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;
    const requestUser = request.user;

    if (!requestUser) {
      return response
        .status(401)
        .json({ error: 'User, token missing or invalid' });
    }
    try {
      const user = await User.findById(requestUser.id);

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
  }
);

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'User, token missing or invalid' });
  }
  try {
    const blogToDelete = await Blog.findById(id);
    if (!blogToDelete) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (user.id.toString() === blogToDelete.user.toString()) {
      console.log('kohta 5');
      const result = await Blog.findOneAndDelete({ _id: id });
      if (!result) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(204).end();
    } else {
      return res.status(401).json({ error: 'permission denied' });
    }
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { likes } = req.body;
    const id = req.params.id;

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

blogsRouter.post(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    const { comment } = request.body;
    const blogId = request.params.id;
    const requestUser = request.user;

    if (!requestUser) {
      return response
        .status(401)
        .json({ error: 'User, token missing or invalid' });
    }
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' });
      }
      blog.comments.push({ content: comment, user: requestUser._id });
      await blog.save();
      response
        .status(201)
        .json({ message: 'Comment added successfully', comment });
    } catch (exp) {
      next(exp);
    }
  }
);

module.exports = blogsRouter;
