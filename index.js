
const express = require('express')
const app = express()
app.use(express.static('dist'))
var morgan = require('morgan')

var cors = require('cors')
app.use(cors())
app.use(express.json())

const Person = require('./models/person')

const mongoose = require('mongoose')

/* const PersonSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
}) */

const password = process.argv[2]

// connect to the database
const connectionStr = `mongodb+srv://anna:${password}@fullstack.9qs6gkk.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`
const url = connectionStr
console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
/* eslint-disable-next-line */
morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({})
    await persons
    response.json(persons)
  } catch (error) {
    /* eslint-disable-next-line */
    next(error)
  }
})

/* app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    response.status(404).json({ Error: 'Not Found' })
  } else {
    response.json(person)
  }
}) */

app.delete('/api/persons/:id', async (request, response) => {
  const id = request.params.id
  try {
    await Person.deleteOne({ _id: id })
    const persons = await Person.find({})
    response.status(204).json(persons)
  } catch (error) {
    /* eslint-disable-next-line */
    next(error)
  }
})


app.post('/api/persons', async (request, response) => {
  mongoose.connect(connectionStr, {})
  const body = request.body
  console.log(request.body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  try {
    // Check if the name already exists in the phonebook
    const existingPerson = await Person.findOne({ name: body.name })
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Person({
      _id: body._id,
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

  } catch (error) {
    console.error('Error saving person:', error)
    /* eslint-disable-next-line */
    next(error)
  }
})

/* app.get('/info', (request, response) => {
  let len = persons.length
  let currentTime = new Date()
  let formatTime = currentTime.toDateString() + ' ' + currentTime.toTimeString()
  let message = `<p> Phonebook has info for ${len} people</p>` + `${formatTime}`
  response.send(message)
}) */
/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  console.error('Error: ', err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})