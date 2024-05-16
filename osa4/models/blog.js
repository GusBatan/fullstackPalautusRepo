const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

blogSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    if (!returnedObject.likes && typeof returnedObject.likes !== 'number') {
      returnedObject.likes = 0;
    }
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Blog;
