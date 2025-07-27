import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Tag } from "../../../shared/models"

interface TagState {
    tags: Tag[]
    selectedTags: string[]
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TagState = {
    tags: [],
    selectedTags: [],
    status: "idle",
    error: null
}

export const fetchTags = createAsyncThunk<Tag[], void>('tags/fetchTags', async () => {
    const tags = await window.electronAPI.getTags()
    return tags
})

export const createTag = createAsyncThunk<Tag, Omit<Tag, 'id'>, {rejectValue: string}>('tags/createTag', async (tag, {rejectWithValue}) => {
    
    try {
        const response = await window.electronAPI.createTag(tag)
        if (!response) {
            return rejectWithValue('Failed to create tag')
        }
        return response
    } catch (error) {
        let cleanMessage = "Failed to create tag"
        if (error instanceof Error) {
            const fullMessage = error.message
            if (error.message.includes('Error invoking remote method')) {
                const parts = fullMessage.split('Error: ')
                cleanMessage = parts[parts.length - 1] || fullMessage
            } else {
                cleanMessage = error.message
            }
        }
        return rejectWithValue(cleanMessage)
    }
})

export const deleteTag = createAsyncThunk<string, string>('tags/deleteTag', async (id) => {
    await window.electronAPI.deleteTag(id)
    return id
})

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setSelectedTags: (state, action: PayloadAction<string | string[]>) => {
            if (Array.isArray(action.payload)) {
                state.selectedTags = action.payload
            }
            else if (state.selectedTags.includes(action.payload)) {
                state.selectedTags = state.selectedTags.filter(tag => tag !== action.payload)
            } else {
                state.selectedTags.push(action.payload)
            }
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        }   
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.tags = action.payload
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to fetch tags'
            })
            .addCase(createTag.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.tags.push(action.payload)
            })
            .addCase(createTag.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || 'Failed to create tag'
            })

        builder
            .addCase(deleteTag.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const deletedTagId = action.payload
                if (deletedTagId) {
                    state.tags = state.tags.filter(tag => tag.id !== deletedTagId)
                }
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to delete tag'
            })
    }
})

export const { setSelectedTags, setError } = tagsSlice.actions
export default tagsSlice.reducer