const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const savePersons = (name, number) => {
  
  person.save().then((result) => {
    process.exit(1);
  });
};

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
