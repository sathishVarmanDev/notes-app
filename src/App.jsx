import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {
  // React.useState(() => ...) is  lazy state initialization. Used when you have an expensive computation for the initial state value
  const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId, setCurrentNoteId] = React.useState(
    // OR (notes[0]?.id) || "". checks if there is a value inside notes[0], if true, then if will assign notes[0].id to notes state
    (notes[0] && notes[0].id) || ""
  )
  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
  console.log("currentNote", currentNote);

  // everytime "notes" state is updated, update the notes key in local storage
  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    setNotes(prevNotes => {
      const newArray = []
      for (let i = 0; i < prevNotes.length; i++) {
        if (prevNotes[i].id === currentNoteId) {
          newArray.unshift({ ...prevNotes[i], body: text })
        } else {
          newArray.push(prevNotes[i]);
        }
      }
      return newArray
    })
  }

  console.log(notes)

  function deleteNote(event, noteId) {
    // stops delete button's(child) event from triggering the event listener of fthe notes title(parent). Source: https://rb.gy/pkzxk
    console.log("before stopPropagate", event, noteId);
    event.stopPropagation();
    console.log("after stopPropagate", event, noteId);
    setNotes(prevNotes => {
      console.log("prevNotes", prevNotes);
      return prevNotes.filter((note) => {
        return noteId !== note.id 
      })
    })

  } 

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={currentNote}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
