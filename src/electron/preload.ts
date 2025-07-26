import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI } from '../shared/types.js'
import { CreateNote, GetNotes, GetNoteById, UpdateNote, DeleteNote, TogglePinNote } from '../shared/types.js'

console.log('Preload script loaded')

const electronAPI: ElectronAPI = {
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    getNoteById: (...args: Parameters<GetNoteById>) => ipcRenderer.invoke('getNoteById', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    updateNote: (...args: Parameters<UpdateNote>) => ipcRenderer.invoke('updateNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    togglePinNote: (...args: Parameters<TogglePinNote>) => ipcRenderer.invoke('togglePinNote', ...args)
}

console.log('Exposing electronAPI to window:', electronAPI)
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
console.log('electronAPI exposed successfully!')
