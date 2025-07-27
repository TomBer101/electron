import { AppError } from './AppError.js'

export const wrapAsync = async <T>(fn: () => Promise<T>): Promise<{data: T | null, error: string | null}> => {
    try {
        return {data: await fn(), error: null}
    } catch (error) {
        return {data: null, error: (error as Error).message || 'An unknown error occurred'}
    }
}

// Modified function to throw errors for Redux compatibility
export const handleIPCError = async <T>(
    handler: () => Promise<T>
): Promise<T> => {
    try {
        return await handler()
    } catch (error) {
        const errorMessage = error instanceof AppError 
            ? error.message 
            : (error as Error).message || 'An unknown error occurred'
        
        console.error('IPC Handler Error:', error)
        throw new Error(errorMessage)
    }
}

