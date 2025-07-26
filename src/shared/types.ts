import { Note, NoteInput } from "./models.js"

// Base response type for IPC calls
export interface IPCResponse<T> {
    success: boolean
    data?: T
    error?: string
}

// Specific response types
export type GetNotesResponse = IPCResponse<Note[]>
export type GetNoteByIdResponse = Note // Throws on error
export type CreateNoteResponse = IPCResponse<Note>
export type UpdateNoteResponse = IPCResponse<Note>
export type DeleteNoteResponse = IPCResponse<{ success: boolean }>
export type TogglePinNoteResponse = IPCResponse<Note>

// Function types
export type GetNotes = () => Promise<GetNotesResponse>
export type GetNoteById = (id: string) => Promise<GetNoteByIdResponse>
export type CreateNote = (noteInput: NoteInput) => Promise<CreateNoteResponse>
export type UpdateNote = (id: string, noteInput: Partial<NoteInput>) => Promise<UpdateNoteResponse>
export type DeleteNote = (id: string) => Promise<DeleteNoteResponse>
export type TogglePinNote = (id: string) => Promise<TogglePinNoteResponse>

export interface ElectronAPI {
    getNotes: GetNotes
    getNoteById: GetNoteById
    createNote: CreateNote
    updateNote: UpdateNote
    deleteNote: DeleteNote
    togglePinNote: TogglePinNote
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}