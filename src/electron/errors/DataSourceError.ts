import { AppError } from "./AppError.js"

export class DataSourceError extends AppError {
    constructor(message: string, public readonly code: number) {
        super(message, code)
    }
}

export class DataSourceInitializationError extends DataSourceError {
    constructor(message: string) {
        super(message, 500)
    }
}

export class DataSourceReadError extends DataSourceError {
    constructor(message: string) {
        super(message, 500)
    }
    }