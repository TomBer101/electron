import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI } from '../shared/types.js'
import { NoteInput } from '../shared/models.js'

console.log('Preload script loaded')

const electronAPI: ElectronAPI = {
    getNotes: () => ipcRenderer.invoke('getNotes'),
    getNoteById: (id: string) => ipcRenderer.invoke('getNoteById', id),
    createNote: (noteInput: NoteInput) => ipcRenderer.invoke('createNote', noteInput),
    updateNote: (id: string, noteInput: Partial<NoteInput>) => ipcRenderer.invoke('updateNote', id, noteInput),
    deleteNote: (id: string) => ipcRenderer.invoke('deleteNote', id),
    togglePinNote: (id: string) => ipcRenderer.invoke('togglePinNote', id)
}

console.log('Exposing electronAPI to window:', electronAPI)
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
console.log('electronAPI exposed successfully!')
