import { AppError } from "./AppError"

export class TagNotFoundError extends AppError {
    constructor(id: string) {
        super(`Tag with id ${id} not found`, 404)
    }
}

export class TagValidationFailedError extends AppError {
    constructor(message: string) {
        super(message, 400)
    }
}