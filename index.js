const express = require('express')
const app = express()
app.use(express.static('dist'))
var morgan = require('morgan')

var cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')

const PersonSchema = new mongoose.Schema({
    _id: String,
    name: String,
    number: String,
});

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
// connect to the database
const connectionStr = `mongodb+srv://anna:${password}@fullstack.9qs6gkk.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`;
mongoose.connect(connectionStr, {});
const Person = mongoose.model('Person', PersonSchema);


morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

// useless after connect to mongodb
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', async (request, response) => {
    mongoose.connect(connectionStr, {})
    const persons = await Person.find({})
    await persons
    response.json(persons)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        response.status(404).json({ Error: 'Not Found' })
    } else {
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    // Check if the name already exists in the phonebook
    const existingPerson = persons.find(person => person.name === body.name);
    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
    let len = persons.length
    let currentTime = new Date();
    let formatTime = currentTime.toDateString() + ' ' + currentTime.toTimeString()
    let message = `<p> Phonebook has info for ${len} people</p>` + `${formatTime}`
    response.send(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})