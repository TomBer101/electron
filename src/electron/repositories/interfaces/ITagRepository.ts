import { Tag } from "../../../shared/models"

export interface ITagRepository {
    getTags: () => Promise<Tag[]>
    createTag: (tag: Omit<Tag, 'id'>) => Promise<Tag>
    updateTag: (id: string, tag: Tag) => Promise<Tag>
    deleteTag: (id: string) => Promise<boolean>
}