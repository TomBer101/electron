import { ITagRepository } from "../repositories/interfaces/ITagRepository.js"
import { Tag } from "../../shared/models.js"
import { TagNotFoundError, TagValidationFailedError } from "../errors/TagNotFoundError.js"
import { NotesService } from "./NotesService.js"

export class TagsService {
    constructor(private tagRepository: ITagRepository,
        private notesService: NotesService
    ) {}

    async getTags(): Promise<Tag[]> {
        const tags = await this.tagRepository.getTags()
        
        // Ensure we return an array
        if (!Array.isArray(tags)) {
            console.error('TagsService.getTags() - Expected array but got:', tags)
            return []
        }
        
        return tags
    }

    async createTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
        if (!tag.name?.trim()) {
            throw new TagValidationFailedError('Tag name is required')
        }

        const sanitizedTag: Omit<Tag, 'id'> = {
            ...tag,
            name: tag.name.trim(),
        }

        return await this.tagRepository.createTag(sanitizedTag)
    }

    async deleteTag(id: string): Promise<boolean> {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new TagValidationFailedError('Tag ID is required')
        }

        try {
            await this.removeTagFromNotes(id)
            return await this.tagRepository.deleteTag(id)
        } catch (error) {
            console.error('Error deleting tag:', error)
            throw new TagNotFoundError(id)
        }
    }

    private async removeTagFromNotes(id: string): Promise<void> {
        const notes = await this.notesService.getNotes()
        for (const note of notes) {
            if (note.tags.includes(id)) {
                const updatedTags = note.tags.filter(tag => tag !== id)
                await this.notesService.updateNote(note.id, { tags: updatedTags })
            }
        }
    }
}

