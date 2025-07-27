import { INoteRepository } from "./interfaces/INoteRepository.js";
import { Note, NoteInput } from "../../shared/models.js";
import { IDataSource } from "../lib/dataSources/IDataSource.js";
import { v4 as uuidv4 } from 'uuid';

export class NotesRepository implements INoteRepository {
    constructor(private dataSource: IDataSource<Note>) {}

    async getNotes(): Promise<Note[]> {
        const notes = await this.dataSource.read()
        return notes.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }

    async getNoteById(id: string): Promise<Note | null> {
        return this.dataSource.findById(id)
    }

    async createNote(note: NoteInput): Promise<Note> {
        const notes = await this.dataSource.read()
        const newNote = { ...note, id: uuidv4(), createdAt: new Date(), tags: note.tags || []}

        notes.push(newNote)
        await this.dataSource.write(notes)
        return newNote
    }

    async updateNote(id: string, note: Partial<NoteInput>): Promise<Note | null>  {
        const existingNote = await this.dataSource.findById(id)
        if (!existingNote) return null

        await this.dataSource.update(id, note)
        return await this.dataSource.findById(id)
    }

    async deleteNote(id: string): Promise<boolean> {
        const existingNote = await this.dataSource.findById(id)
        if (!existingNote) return false

        await this.dataSource.delete(id)
        return true
    }

    async searchNotes(query: string): Promise<Note[]> {
        const notes = await this.dataSource.read()
        return notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        )
    }
}