    import { INoteRepository } from "../repositories/interfaces/INoteRepository.js"
import { NoteInput, Note } from "../../shared/models.js"
import { NoteNotFoundError, NoteValidationFailedError } from "../errors/NoteNotFoundError.js"

export class NotesService {
    constructor(private noteRepository: INoteRepository) {}

    async getNotes(): Promise<Note[]> {
        return await this.noteRepository.getNotes()
    }

    async getNoteById(id: string): Promise<Note | null> {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new NoteValidationFailedError('Note ID is required')
        }
        
        try {
            return await this.noteRepository.getNoteById(id)
        } catch (error) {
            console.error('Error getting note by ID:', error)
            throw new NoteNotFoundError(id)
        }
    }

    async createNote(note: NoteInput): Promise<Note> {
        if (!note.title?.trim()) {
            throw new NoteValidationFailedError('Title is required')
        }
        if (!note.content?.trim()) {
            throw new NoteValidationFailedError('Content is required')
        }

        const sanitizedInput: NoteInput = {
            title: note.title.trim(),
            content: note.content.trim(),
            isPinned: note.isPinned ?? false,
            tags: note.tags ?? []
        }

        return await this.noteRepository.createNote(sanitizedInput)
    }

    async updateNote(id: string, note: Partial<NoteInput>): Promise<Note | null> {
        if (!id || typeof id !== 'string') {
            throw new NoteValidationFailedError('Note ID is required')
        }

        const existingNote = await this.noteRepository.getNoteById(id)
        if (!existingNote) {
            throw new NoteNotFoundError(id)
        }

        if (note.title != undefined && !note.title.trim()) {
            throw new NoteValidationFailedError('Note title cannot be empty!')
        }
        if (note.content != undefined && !note.content.trim()) {
            throw new NoteValidationFailedError('Note content cannot be empty!')
        }

        const sanitizedInput: Partial<NoteInput> = {}
        if (note.title !== undefined) sanitizedInput.title = note.title.trim()
        if (note.content !== undefined) sanitizedInput.content = note.content.trim()
        if (note.isPinned !== undefined) sanitizedInput.isPinned = Boolean(note.isPinned)
        if (note.tags !== undefined) sanitizedInput.tags = note.tags

        return await this.noteRepository.updateNote(id, sanitizedInput)
    }

    async deleteNote(id: string): Promise<boolean> {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new NoteValidationFailedError('Note ID is required')
        }

        try {
            return await this.noteRepository.deleteNote(id)
        } catch (error) {
            console.error('Error deleting note:', error)
            throw new NoteNotFoundError(id)
        }
    }

    async togglePinNote(id: string): Promise<Note | null> {
        const note = await this.noteRepository.getNoteById(id)
        if (!note) {
            throw new NoteNotFoundError(id)
        }

        note.isPinned = !note.isPinned
        return await this.noteRepository.updateNote(id, note)
    }
}