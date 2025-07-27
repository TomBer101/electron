import { configureStore } from "@reduxjs/toolkit"
import notesReducer from "../features/notes/notesSlice"
import tagsReducer from "../features/tags/tagsSlice"

const store = configureStore({
    reducer: {
        notes: notesReducer,
        tags: tagsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store