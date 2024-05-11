const express = require("express");
const app = express();

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-44-234345" },
  { id: 4, name: "Mary PoppenDICK", number: "39-23-6423122" },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toDateString()} ${currentDate.toLocaleTimeString()} GTM${
    currentDate.getTimezoneOffset() / -60 > 0 ? "+" : ""
  }${currentDate.getTimezoneOffset() / -60}${
    currentDate.toString().match(/\(([^)]+)\)/)[1]
  }`;
  response.json(
    `Phonebook has info for ${persons.length} people and the time of request is: ${formattedDate}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  console.log("id oli", request.params.id);
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
