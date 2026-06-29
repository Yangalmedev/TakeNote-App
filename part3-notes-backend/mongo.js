// THIS FILE IS FOR CONNECTING MONGODB_ATLAS DATABASE

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const content = process.argv[3]
const important = process.argv[4]
const uri = `mongodb+srv://yangalmedev:${password}@cluster0.yte5q44.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(uri, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// If only password is given → show all entries
if (!content && !important) {
  Note.find({}).then(notes => {
    console.log('notes:')
    notes.forEach(note => {
      console.log(`${note.content} ${note.important}`)
    })
    mongoose.connection.close() // ← correct place, INSIDE .then()
  })

// If name and number are given → add new entry
} else if (content && important) {
  const note = new Note({ content, important })

  note.save().then(() => {
    console.log(`added ${content} important ${important} to notes`)
    mongoose.connection.close() // ← correct place, INSIDE .then()
  })

// If only one of content/important is given → warn the user  
} else {
  console.log('provide both content and important')
  mongoose.connection.close()
}


/* note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */