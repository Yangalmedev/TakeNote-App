
const Note = ({note, toggleImportance}) => {
  const label = note.important ? 'set to not important' : 'set important'

  return (
    <li className="note">
      {note.content}
      <button style={
        {
          marginLeft: '30px', 
          marginRight: '30px'
        }
      } onClick={() => toggleImportance(note.id)}>
        {label}
      </button>
      {note.important ? 'curently important' : 'currently not important'}
    </li>
  )
}

export default Note;