import { ITagRepository } from "./interfaces/ITagRepository.js"
import { IDataSource } from "../lib/dataSources/IDataSource.js"
import { Tag } from "../../shared/models.js"
import { v4 as uuidv4 } from 'uuid'
import { TagValidationFailedError } from "../errors/TagNotFoundError.js"

export class TagsRepository implements ITagRepository {
    constructor(private dataSource: IDataSource<Tag>) {}

    async getTags(): Promise<Tag[]> {
        return await this.dataSource.read()
    }

    async createTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
        // Check if tag with same name exists
        const existingTags = await this.dataSource.read();
        const tagExists = existingTags.some(t => t.name.toLowerCase() === tag.name.toLowerCase());
        
        if (tagExists) {
            throw new TagValidationFailedError(`Tag with name "${tag.name}" already exists`);
        }

        const newTag = {
            ...tag,
            id: uuidv4()
        }
        
        await this.dataSource.create(newTag)
        return newTag
    }

    async updateTag(id: string, tag: Tag): Promise<Tag> {
        const updatedTag = {
            ...tag,
            id: id
        }
        await this.dataSource.update(id, updatedTag)
        return updatedTag
    }

    async deleteTag(id: string): Promise<boolean> {
        await this.dataSource.delete(id)
        return true
    }
}