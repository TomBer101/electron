import { AppError } from './AppError.js'

export const wrapAsync = async <T>(fn: () => Promise<T>): Promise<{data: T | null, error: string | null}> => {
    try {
        return {data: await fn(), error: null}
    } catch (error) {
        return {data: null, error: (error as Error).message || 'An unknown error occurred'}
    }
}

// New function specifically for IPC handlers
export const handleIPCError = async <T>(
    handler: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> => {
    try {
        const data = await handler()
        return { success: true, data }
    } catch (error) {
        const errorMessage = error instanceof AppError 
            ? error.message 
            : (error as Error).message || 'An unknown error occurred'
        
        console.error('IPC Handler Error:', error)
        return { success: false, error: errorMessage }
    }
}

// For cases where you want to throw errors to the renderer
export const handleIPCErrorWithThrow = async <T>(
    handler: () => Promise<T>
): Promise<T> => {
    try {
        return await handler()
    } catch (error) {
        console.error('IPC Handler Error:', error)
        throw error // Re-throw to be handled by Electron's IPC error handling
    }
}