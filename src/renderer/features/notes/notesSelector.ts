import type { RootState } from "../../app/store"


export const selectNotes = (state: RootState) => state.notes.notes
export const selectNotesStatus = (state: RootState) => state.notes.status
export const selectNotesError = (state: RootState) => state.notes.error
export const selectNotesLoading = (state: RootState) => state.notes.loading
export const selectNotesById = (state: RootState, id: string) => state.notes.notes.find(note => note.id === id)
