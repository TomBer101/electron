import { INoteRepository } from "../repositories/interfaces/INoteRepository.js"
import { NoteInput, Note } from "../../shared/models.js"

export class NotesService {
    constructor(private noteRepository: INoteRepository) {}

    async getNotes(): Promise<Note[]> {
        return await this.noteRepository.getNotes()
    }

    async getNoteById(id: string): Promise<Note | null> {
        if (!id || typeof id !== 'string') throw new Error('Note ID is required')
        
        return await this.noteRepository.getNoteById(id)
    }

    async createNote(note: NoteInput): Promise<Note> {
        if (!note.title?.trim()) throw new Error('Title is required')
        if (!note.content?.trim()) throw new Error('Content is required')

            const sanitizedInput: NoteInput = {
                title: note.title.trim(),
                content: note.content.trim(),
                isPinned: note.isPinned ?? false,
                tags: note.tags ?? []
            }

        return await this.noteRepository.createNote(sanitizedInput)
    }

    async updateNote(id: string, note: Partial<NoteInput>): Promise<Note | null> {
        if (!id || typeof id !== 'string') throw new Error('Note ID is required')

        const existingNote = await this.noteRepository.getNoteById(id)
        if (!existingNote) throw new Error('Note not found')

        if (note.title != undefined && !note.title.trim()) throw new Error('Note title cannot be empty!')
        if (note.content != undefined && !note.content.trim()) throw new Error('Note content cannot be empty!')

        const sanitizedInput: Partial<NoteInput> = {}
        if (note.title !== undefined) sanitizedInput.title = note.title.trim()
        if (note.content !== undefined) sanitizedInput.content = note.content.trim()
        if (note.isPinned !== undefined) sanitizedInput.isPinned = Boolean(note.isPinned)
        if (note.tags !== undefined) sanitizedInput.tags = note.tags

        return await this.noteRepository.updateNote(id, sanitizedInput)
    }
}