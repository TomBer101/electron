import { Note, NoteInput, Tag } from "./models.js"

// Function types - now return direct data or throw errors
export type GetNotes = () => Promise<Note[]>
export type GetNoteById = (id: string) => Promise<Note>
export type CreateNote = (noteInput: NoteInput) => Promise<Note>
export type UpdateNote = (id: string, noteInput: Partial<NoteInput>) => Promise<Note>
export type DeleteNote = (id: string) => Promise<{ success: boolean }>
export type TogglePinNote = (id: string) => Promise<Note>

export type GetTags = () => Promise<Tag[]>
export type CreateTag = (tag: Omit<Tag, 'id'>) => Promise<Tag>
export type DeleteTag = (id: string) => Promise<{ success: boolean }>

export interface ElectronAPI {
    getNotes: GetNotes
    getNoteById: GetNoteById
    createNote: CreateNote
    updateNote: UpdateNote
    deleteNote: DeleteNote
    togglePinNote: TogglePinNote
    getTags: GetTags
    createTag: CreateTag
    deleteTag: DeleteTag
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}