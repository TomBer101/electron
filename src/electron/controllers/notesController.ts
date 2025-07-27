import electron from 'electron'
import { NotesService } from '../services/NotesService.js'
import { handleIPCError } from '../errors/errorHandler.js'
import { CreateNote, DeleteNote, GetNoteById, GetNotes, UpdateNote } from '../../shared/types.js'

const { ipcMain } = electron


export class NotesController {
    constructor(private notesService: NotesService) {}

    registerHandlers(): void {
        ipcMain.handle('getNotes', async (_, ...args: Parameters<GetNotes>) => {
            return await handleIPCError(async () => {
                return await this.notesService.getNotes(...args)
            })
        })

        // Get note by ID
        ipcMain.handle('getNoteById', async (_, ...args: Parameters<GetNoteById>) => {
            return await handleIPCError(async () => {
                const note = await this.notesService.getNoteById(...args)
                if (!note) {
                    throw new Error('Note not found')
                }
                return note
            })
        })

        // Create new note
        ipcMain.handle('createNote', async (_, ...args: Parameters<CreateNote>) => {
            return await handleIPCError(async () => {
                return await this.notesService.createNote(...args)
            })
        })

        // Update note
        ipcMain.handle('updateNote', async (_, ...args: Parameters<UpdateNote>) => {
            return await handleIPCError(async () => {
                const note = await this.notesService.updateNote(...args)
                if (!note) {
                    throw new Error('Note not found')
                }
                return note
            })
        })

        // Delete note
        ipcMain.handle('deleteNote', async (_, ...args: Parameters<DeleteNote>) => {
            return await handleIPCError(async () => {
                const success = await this.notesService.deleteNote(...args)
                if (!success) {
                    throw new Error('Failed to delete note')
                }
                return { success: true }
            })
        })

        // Toggle pin note
        ipcMain.handle('togglePinNote', async (_, id: string) => {
            return await handleIPCError(async () => {
                const note = await this.notesService.togglePinNote(id)
                if (!note) {
                    throw new Error('Note not found')
                }
                return note
            })
        })


    }
}