const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yangalmedev:${password}@cluster0.yte5q44.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note(
  {
    content: 'HTML is easy',
    important: true
  },
  {
    content: 'Javascript is a headache',
    important: true
  }
)

Note.find({important: true}).then(result => {
  result.forEach(note => {
    console.log(note)
    console.log('note saved!')
  })
  mongoose.connection.close()
})

/* note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */