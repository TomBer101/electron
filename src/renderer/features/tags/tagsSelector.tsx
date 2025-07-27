import type { RootState } from "../../app/store"

export const selectTags = (state: RootState) => state.tags.tags
export const selectTagsStatus = (state: RootState) => state.tags.status
export const selectTagsError = (state: RootState) => state.tags.error
export const selectSelectedTags = (state: RootState) => state.tags.selectedTags