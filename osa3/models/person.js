const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    minlength: 8,
    maxlength: 12,
    required: true,
    validate: {
      validator: function (val) {
        return /^(\d{2,3})-(\d{6,7})/.test(val);
      },
    },
  },
  id: Number,
});

const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0); // Exit the process once the connection is closed
  });
};

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  gracefulShutdown();
});

module.exports = mongoose.model('Person', personSchema);
