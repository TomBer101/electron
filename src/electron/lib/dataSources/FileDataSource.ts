import { readFile, writeFile, access, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { IDataSource } from './IDataSource.js'
import { DataSourceReadError } from '../../errors/DataSourceError.js'


export class FileDataSource<T extends { id: string }> implements IDataSource<T> {
    constructor(private filePath: string) {}

    async initialize(): Promise<void> {
        try {
            const directory = dirname(this.filePath)
            await mkdir(directory, { recursive: true })

            if (!(await this.exists())) {
                await this.write([])
            }
        } catch (error) {
            console.error('Error initializing file data source:', error)
            throw new Error('Failed to initialize file data source')
        }
    }

    async exists(): Promise<boolean> {
        try {
            await access(this.filePath)
            return true
        } catch (error) {
            return false
        }
    }

    async read(): Promise<T[]> {
        try {
            const content = await readFile(this.filePath, 'utf-8')
  
            const parsed = JSON.parse(content)
            return parsed
        } catch (error) {
            console.error('Error reading JSON file:', error)
            return []
        }
    }

    async write(data: T[]): Promise<void> {
        try {
            await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
        } catch (error) {
            console.error('Error writing JSON file:', error)
            throw new Error('Failed to write data')
        }
    }

    async update(id: string,data: Partial<Omit<T, 'id'>>): Promise<void> {
        try {
            const existingData = await this.read()
            const updatedData = existingData.map(item => item.id === id ? { ...item, ...data } : item)
            await this.write(updatedData)
        } catch (error) {
            console.error('Error updating JSON file:', error)
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const existingData = await this.read()
            const filteredData = existingData.filter(item => item.id !== id)
            await this.write(filteredData)
        } catch (error) {
            console.error('Error deleting from JSON file:', error)
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            const existingData = await this.read()
            return existingData.find(item => item.id === id) || null
        } catch (error) {
            console.error('Error finding by ID:', error)
            throw new DataSourceReadError(`Failed to find item by ID: ${id}`)
        }
    }

    async create(data: T): Promise<void> {
        try {
            const existingData = await this.read()
            existingData.push(data)
            await this.write(existingData)
        } catch (error) {
            console.error('Error creating in JSON file:', error)
            throw new Error('Failed to create item')
        }
    }
}






