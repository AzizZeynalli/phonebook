const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', (request, response) => {
    return JSON.stringify(request.body)
})

const logger = (request, response, next) => {
    if(request.method === 'POST'){
        morgan(':method :url :status :res[content-length] - :response-time ms :data')(request, response, next)
    }else{
        morgan('tiny')(request, response, next)
    }
}

app.use(cors())
app.use(express.json())
app.use(logger)

let persons = [
    { 
      "id": 10,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 5,
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
    response.send('<h1>Phonebook application</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date()
    response.send(`Phonebook has info for ${persons.length} people <br/>${currentTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.send(person)
    } else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()   
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const randomId =  Math.round(500*(Math.random()))
    const exists = persons.find(person => person.name === body.name)
    if (exists){
        return response.status(400).json({
            error: 'This name already exists in the phonebook'
        })
    }
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})