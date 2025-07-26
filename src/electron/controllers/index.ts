import { NotesController } from './notesController.js'

export class ControllerManager {
    private notesController: NotesController

    constructor(notesController: NotesController) {
        this.notesController = notesController
    }

    registerHandlers(): void {
        this.notesController.registerHandlers()
    }
}

export { NotesController }