import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { NotesPage } from './pages/NotesPage'
import { NoteForm } from './components/notes/NoteForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NotesPage />} />
          <Route path="/notes/:id/edit" element={<NoteForm />} />
          <Route path="/notes/new" element={<NoteForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
