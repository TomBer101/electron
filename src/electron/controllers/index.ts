import { NotesController } from './notesController.js'
import { TagsController } from './tagsController.js'

export class ControllerManager {
    private notesController: NotesController
    private tagsController: TagsController

    constructor(notesController: NotesController, tagsController: TagsController) {
        this.notesController = notesController
        this.tagsController = tagsController
    }

    registerHandlers(): void {
        this.notesController.registerHandlers()
        this.tagsController.registerHandlers()
    }
}

export { NotesController, TagsController }