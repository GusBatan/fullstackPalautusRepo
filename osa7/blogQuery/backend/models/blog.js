const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: { type: String, required: true },
  likes: Number,
  comments: [commentSchema]
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
