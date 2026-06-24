import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import noteService from "./services/notesServices";
import Note from './components/Note';
import Footer from "./components/Footer";

const App = () => {
  const [notesList, setNotesList] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showNote, setShowNote] = useState(true);
  const [errorMessage, setErrorMessage ] = useState('some error happened...')

  // Getting data from the server for rendering
  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(initialNotes => {
        console.log(initialNotes)
        console.log('Promise Fullfilled')
        setNotesList(initialNotes)
      })
      .catch(() => {
        <Notification errorMessage={errorMessage} />
      })
  }, [])


  // Do not render anything if notes is still null
  if(!notesList){
    return null
  }
  console.log('rendering', notesList.length, 'notes')
  console.log(notesList)


  //Adding notes to json-server
  const addNote = (event) => {
    event.preventDefault();
    console.log('Form Submitted', event.target);
    const note = {
      content: newNote,
      important: Math.random() < 0.5
    }

    if(note.content === ''){
      alert('Value empty, please type in something');
    } else {
      noteService
        .create(note)
        .then(response => {
          setNotesList(notesList.concat(response));
          setNewNote('');
          console.log('added new note', response)
        })
    }
  };


  // Changing state and re-rendering when we type for a new note
  const handleTyping = (event) => {
    // console.log('typing new note:', event.target.value)
    setNewNote(event.target.value);
  }

  const notesToShow = showNote ? notesList : notesList.filter((note) => note.important);
  

//Changing importance of a note
  const toggleImportance = (id) => {
    console.log('toggled')
    
    const note = notesList.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    console.log('previous data', note)
    console.log('current data',changedNote)

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotesList(notesList.map(note => note.id === id ? response : note))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setNotesList(notesList.filter(n => n.id !== id))
      })
  }

  
// Deleting notes saved in the json-server
  const handleDelete = (id) => {
    noteService
      .remove(id)
      .then(() => {
        setNotesList(notesList.filter(note => note.id !== id));
      })
      .catch(error => {
        console.error('Failure to delete note:', error)
        setNotesList(notesList.filter(n => n.id !== id))
      })
  };

  


  return (
    <div>
      <h1>Notes</h1>
      <Notification errorMessage={errorMessage} />
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={toggleImportance}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input placeholder="Enter..." type="text" onChange={handleTyping} value={newNote}/>
        <button>Save</button>
      </form>
      <button onClick={() => setShowNote(!showNote)}>{showNote ? 'Show important' : 'Show all'}</button>
      <br /><br />
      <div>
        {notesList.map(note => (
          <li key={note.id}>
            {note.content}
            <button style={{marginLeft: '30px'}} onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default App;