
export interface IDataSource<T> {
    read: () => Promise<T[]>
    write: (data: T[]) => Promise<void>
    update: (id: string,data: Partial<Omit<T, 'id'>>) => Promise<void>
    delete: (id: string) => Promise<void>
    findById: (id: string) => Promise<T | null>
    create: (data: T) => Promise<void>
}