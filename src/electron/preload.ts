import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes } from '../shared/types.js'

contextBridge.exposeInMainWorld('electronAPI',  {
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
})