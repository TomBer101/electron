import electron from 'electron'
import { NotesService } from '../services/NotesService.js'
import { NoteInput } from '../../shared/models.js'
import { handleIPCError, handleIPCErrorWithThrow } from '../errors/errorHandler.js'

const { ipcMain } = electron


export class NotesController {
    constructor(private notesService: NotesService) {}

    registerHandlers(): void {
        // Get all notes - using error handler that returns structured response
        ipcMain.handle('getNotes', async () => {
            return await handleIPCError(async () => {
                return await this.notesService.getNotes()
            })
        })

        // Get note by ID - using error handler that throws (for 404 cases)
        ipcMain.handle('getNoteById', async (_, id: string) => {
            return await handleIPCErrorWithThrow(async () => {
                return await this.notesService.getNoteById(id)
            })
        })

        // Create new note
        ipcMain.handle('createNote', async (_, noteInput: NoteInput) => {
            return await handleIPCError(async () => {
                return await this.notesService.createNote(noteInput)
            })
        })

        // Update note
        ipcMain.handle('updateNote', async (_, id: string, noteInput: Partial<NoteInput>) => {
            return await handleIPCError(async () => {
                return await this.notesService.updateNote(id, noteInput)
            })
        })

        // Delete note
        ipcMain.handle('deleteNote', async (_, id: string) => {
            return await handleIPCError(async () => {
                await this.notesService.deleteNote(id)
                return { success: true }
            })
        })

    }
}