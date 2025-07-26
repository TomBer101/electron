import { AppError } from "./AppError.js"

export class NoteNotFoundError extends AppError {
    constructor(noteId: string) {
        super(`Note with ID ${noteId} not found`, 404)
    }
}

export class NoteValidationFailedError extends AppError {
    constructor(message: string) {
        super(message, 400)
    }
}
