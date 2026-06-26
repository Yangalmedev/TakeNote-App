const { log } = require('console')
const express = require('express')
const app = express()
const morgan = require('morgan')

// Define a custom token to capture POST body data
morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use the tiny configuration and append the custom body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Security & Assets
app.use(express.static('dist'))

let notes = [
  { id: '1', content: 'HTML is easy', important: true },
  { id: '2', content: 'Browser can execute only JavaScript', important: false},
  { id: '3', content: 'GET and POST are the most important methods of HTTP protocol', important: true },
  { id: '4', content: 'My name is Althea', important: true }
]

app.use(express.json())  // Activates a built-in Express middleware called a JSON parser.

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
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

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes.concat(note)
  log(note)
  response.json(note)
  log('Request Headers: ', request.headers);
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

// Binds the http server assigned to the app variable, to listen to HTTP requests sent to port 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})







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