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

module.exports = mongoose;
