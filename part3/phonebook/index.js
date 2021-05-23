require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.static('build'))

const morgan = require('morgan')
const Person = require('./models/person')

app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  tokens.content(req, res),
].join(' ')))

app.use(express.json())

app.get('/', (request, response) => {
  response.send(
    '<div><h1>Hello World!</h1><a href="/api/persons">Click to go api page</a></div>',
  )
})

app.get('/info', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.send(
      `<div><p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p></div>`,
    )
  }).catch((error) => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  }).catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  }).catch((error) => next(error))
})

// eslint-disable-next-line
app.post('/api/persons', (request, response, next) => {
  const { body } = request
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  }).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// eslint-disable-next-line
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
