const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, minLength: 3 },
  name: { type: String, required: true, minLength: 3 },
  password: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

const User = mongoose.model('User', userSchema);

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = User;
