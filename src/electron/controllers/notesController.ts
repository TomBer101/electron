import electron from 'electron'
import { NotesService } from '../services/NotesService.js'
import { handleIPCError, handleIPCErrorWithThrow } from '../errors/errorHandler.js'
import { CreateNote, DeleteNote, GetNoteById, GetNotes, UpdateNote } from '../../shared/types.js'

const { ipcMain } = electron


export class NotesController {
    constructor(private notesService: NotesService) {}

    registerHandlers(): void {
        // Get all notes - using error handler that returns structured response
        ipcMain.handle('getNotes', async (_, ...args: Parameters<GetNotes>) => {
            return await handleIPCError(async () => {
                return await this.notesService.getNotes(...args)
            })
        })

        // Get note by ID - using error handler that throws (for 404 cases)
        ipcMain.handle('getNoteById', async (_, ...args: Parameters<GetNoteById>) => {
            return await handleIPCErrorWithThrow(async () => {
                return await this.notesService.getNoteById(...args)
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
                return await this.notesService.updateNote(...args)
            })
        })

        // Delete note
        ipcMain.handle('deleteNote', async (_, ...args: Parameters<DeleteNote>) => {
            return await handleIPCError(async () => {
                await this.notesService.deleteNote(...args)
                return { success: true }
            })
        })


    }
}