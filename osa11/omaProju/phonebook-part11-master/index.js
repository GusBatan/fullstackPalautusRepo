require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
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

const errorHandler = (error, request, response, next) => {
  console.error(error);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Cast Error' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get('/', (request, response) => {
  return response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({}).catch((error) => next(error));
    return response.json(persons);
  } catch (error) {
    next(error);
  }
});

app.get('/info', async (request, response, next) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()} GTM${
    currentDate.getTimezoneOffset() / -60 > 0 ? '+' : ''
  }${currentDate.getTimezoneOffset() / -60}${
    currentDate.toString().match(/\(([^)]+)\)/)[1]
  }`;
  try {
    const persons = await Person.find({}).catch((error) => next(error));

    return response.json(
      `Phonebook has info for ${persons.length} people and the time of request is: ${formattedDate}`
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const persons = await Person.find({}).catch((error) => next(error));

    const result = persons.find((person) => person.id == id);
    if (result) {
      return response.json(result);
    }
    return response.sendStatus(404);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    Person.findOneAndDelete({ id: id })
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => next(error));

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons/post', async (req, res, next) => {
  try {
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
        const newPerson = await person.save();
        return res.status(201).json(newPerson);
      }
    }
    return res
      .status(400)
      .json({ error: 'Request must include both name and number' });
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  try {
    const { name, number } = req.body;
    const id = req.params.id;
    Person.findOneAndUpdate(
      { id: id },
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
      .then((updatedPerson) => {
        res.json(updatedPerson);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
    console.log('error tuli');
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
