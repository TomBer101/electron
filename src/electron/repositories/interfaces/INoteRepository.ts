import { Note, NoteInput } from "../../../shared/models.js"

export interface INoteRepository {
    getNotes: () => Promise<Note[]>
    createNote: (note: NoteInput) => Promise<Note>
    updateNote: (id: string, note: Partial<NoteInput>) => Promise<Note | null>
    deleteNote: (id: string) => Promise<boolean>
    searchNotes: (query: string) => Promise<Note[]>
    getNoteById: (id: string) => Promise<Note | null>
}