require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (request, response) => {
  return response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({});
  return response.json(persons);
});

app.get('/info', async (request, response) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()} GTM${
    currentDate.getTimezoneOffset() / -60 > 0 ? '+' : ''
  }${currentDate.getTimezoneOffset() / -60}${
    currentDate.toString().match(/\(([^)]+)\)/)[1]
  }`;

  const persons = await Person.find({});

  return response.json(
    `Phonebook has info for ${persons.length} people and the time of request is: ${formattedDate}`
  );
});

app.get('/api/persons/:id', async (request, response) => {
  const id = request.params.id;

  const persons = await Person.find({});

  const result = persons.find((person) => person.id == id);
  if (result) {
    return response.json(result);
  }
  return response.sendStatus(404);
});

app.delete('/api/persons/delete/:id', async (req, res) => {
  const id = req.params.id;
  let persons = await Person.find({});
  persons = persons.filter((person) => {
    return person.id != id;
  });
  res.sendStatus(200);
});

app.post('/api/persons/post', async (req, res) => {
  const newPersonsInfo = req.body;
  const persons = await Person.find({});
  console.log(persons, newPersonsInfo);
  if (newPersonsInfo.name && newPersonsInfo.number) {
    if (persons.find((person) => person.name == newPersonsInfo.name)) {
      return res.status(400).json({ error: 'Name must be unique' });
    } else {
      const person = new Person({
        name: newPersonsInfo.name,
        number: newPersonsInfo.number,
        id: Math.floor(Math.random() * 1000000),
      });
      await person.save();
      return res.status(200).json(`Added ${newPersonsInfo.name}`);
    }
  }
  return res
    .status(400)
    .json({ error: 'Request must include both name and number' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
