import { TagsService } from "../services/TagsService.js"
import electron from 'electron'
import { handleIPCError } from '../errors/errorHandler.js'
import { GetTags, CreateTag, DeleteTag } from '../../shared/types.js'

const { ipcMain } = electron

export class TagsController {
    constructor(private tagsService: TagsService) {}

    registerHandlers(): void {
        ipcMain.handle('getTags', async (_, ...args: Parameters<GetTags>) => {
            return await handleIPCError(async () => {
                const result = await this.tagsService.getTags(...args)
                console.log('TagsController.getTags() - Service result:', result)
                console.log('TagsController.getTags() - Type:', typeof result)
                console.log('TagsController.getTags() - Is Array:', Array.isArray(result))
                return result
            })
        })

        ipcMain.handle('createTag', async (_, ...args: Parameters<CreateTag>) => {
            
                return await this.tagsService.createTag(...args)
            
        })

        ipcMain.handle('deleteTag', async (_, ...args: Parameters<DeleteTag>) => {
            return await handleIPCError(async () => {
                const success = await this.tagsService.deleteTag(...args)
                if (!success) {
                    throw new Error('Failed to delete tag')
                }
                return { success: true }
            })
        })
    }
}