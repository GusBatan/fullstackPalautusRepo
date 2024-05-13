const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
  }

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.jk0rxqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);
mongoose.connect(url);