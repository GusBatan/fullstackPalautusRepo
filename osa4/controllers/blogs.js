const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find();
    response.json(blogs);
  } catch (exp) {
    next(exp);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  try {
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

module.exports = blogsRouter;
