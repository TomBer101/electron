import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Note, NoteInput } from "../../../shared/models";

interface NotesState {
    notes: Note[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loading: boolean;
}

const initialState: NotesState = {
    notes: [],
    status: 'idle',
    error: null,
    loading: false
}

export const fetchNotes = createAsyncThunk<Note[], void>('notes/fetchNotes', async () => {
    const response = await window.electronAPI.getNotes()
    return response
})

export const createNote = createAsyncThunk<Note, NoteInput>('notes/createNote', async (noteInput: NoteInput) => {
    const response = await window.electronAPI.createNote(noteInput)
    return response
})

export const updateNote = createAsyncThunk<Note, { id: string, note: Partial<NoteInput> }>('notes/updateNote', async ({ id, note }) => {
    const response = await window.electronAPI.updateNote(id, note)
    return response
})

export const deleteNote = createAsyncThunk<string, string>('notes/deleteNote', async (id: string) => {
    await window.electronAPI.deleteNote(id)
    return id
})

export const togglePinNote = createAsyncThunk<Note, string>('notes/togglePinNote', async (id: string) => {
    const response = await window.electronAPI.togglePinNote(id)
    return response
})

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.notes = action.payload
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to fetch notes'
            })

        builder
            .addCase(createNote.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.notes.push(action.payload)
            })
            .addCase(createNote.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to create note'
            })  

        builder
            .addCase(updateNote.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.notes = state.notes.map(note => note.id === action.payload.id ? action.payload : note)
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to update note'
            })

        builder
            .addCase(deleteNote.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const deletedNoteId = action.payload
                if (deletedNoteId) {
                    state.notes = state.notes.filter(note => note.id !== deletedNoteId)
                }
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to delete note'
            })

        builder
            .addCase(togglePinNote.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(togglePinNote.fulfilled, (state, action) => {
                const updatedNote = action.payload
                state.notes = state.notes.filter(note => note.id !== updatedNote.id)
                
                if (updatedNote.isPinned) {
                    state.notes.unshift(updatedNote)
                } else {
                    state.notes.push(updatedNote)
                }
                state.status = 'succeeded'
            })
            .addCase(togglePinNote.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to toggle pin note'
            })
    }
})

export default notesSlice.reducer