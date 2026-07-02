// THIS FILE IS FOR THE LIVE DEPLOYEMENT TO INTERNET

require('dotenv').config()
const { log } = require('console')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Note = require('./models/note')
const note = require('./models/note')
const app = express()

// Define a custom token to capture POST body data
morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use the tiny configuration and append the custom body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Security & Assets
app.use(express.static('dist'))

const password = process.argv[2]
const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(MONGODB_URI, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

app.use(express.json())  // Activates a built-in Express middleware called a JSON parser.

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}
app.post('/api/notes/', (request, response) => {
  const body = request.body

  if (!body.content){
    // Calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // The note objects are created with the Note constructor function.
  const note = new Note({
    content: body.content,
    important: body.important || false,
    id: generateId()
  })

  notes.concat(note)
  log(note)
  response.json(note)
  log('Request Headers: ', request.headers);

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(404).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT // reads from .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message) 
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)  // ← unknown error? pass to Express default handler
}

app.use(errorHandler)  // this has to be the last loaded middleware, also all the routes should be registered before this!




/* MAKING THE APP INTO A WEB SERVER

// The application imports Node's built-in web server module. 
const http = require('http')

//The code uses the createServer method of the http module to create a new web server. An event handler is registered to the server that is called every time an HTTP request is made to the server's address http://localhost:3001.
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

//The last rows 
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`) 
*/