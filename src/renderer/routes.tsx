import { Route, Routes } from "react-router-dom"
import { NotesPage } from "./pages/NotesPage"
import { NoteForm } from "./components/notes/NoteForm"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<NotesPage />} />
            <Route path="/notes/:id/edit" element={<NoteForm />} />
            <Route path="/notes/new" element={<NoteForm />} />
        </Routes>
    )
}