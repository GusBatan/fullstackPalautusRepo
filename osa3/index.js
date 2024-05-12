const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-44-234345' },
  { id: 4, name: 'Mary PoppenDICK', number: '39-23-6423122' },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()} GTM${
    currentDate.getTimezoneOffset() / -60 > 0 ? '+' : ''
  }${currentDate.getTimezoneOffset() / -60}${
    currentDate.toString().match(/\(([^)]+)\)/)[1]
  }`;
  response.json(
    `Phonebook has info for ${persons.length} people and the time of request is: ${formattedDate}`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const result = persons.find((person) => person.id == id);
  if (result) {
    response.json(result);
  }
  response.sendStatus(404);
});

app.delete('/api/persons/delete/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => {
    return person.id != id;
  });
  res.sendStatus(200);
});

app.post('/api/persons/post', (req, res) => {
  const newPersonsInfo = req.body;

  if (newPersonsInfo.name && newPersonsInfo.number) {
    if (persons.find((person) => person.name == newPersonsInfo.name)) {
      return res.status(400).json({ error: 'Name must be unique' });
    } else {
      persons.push({
        ...newPersonsInfo,
        id: Math.floor(Math.random() * 1000000),
      });
      res.sendStatus(200);
    }
  }
  return res
    .status(400)
    .json({ error: 'Request must include both name and number' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
