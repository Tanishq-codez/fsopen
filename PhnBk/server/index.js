const express = require("express");
const morgan = require("morgan")
const app = express();

app.use(express.json());


let phone = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))

app.get("/api/persons", (req, res) => {
  res.json(phone);
});

app.get("/info", (request, response) => {
  const entriesCount = phone.length;
  const currentDate = new Date();

  response.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${currentDate}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phone.find((person) => {
    return person.id === id;
  });

  if (person) {
    res.json(person);
  } else res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phone = phone.filter((person) => {
    return person.id !== id;
  });
  res.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 10000));
};
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }
  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
  if (phone.find((p) => p.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  phone = phone.concat(person);
  res.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(3001, () => {
  console.log("serverPhone started on port 3001");
});
