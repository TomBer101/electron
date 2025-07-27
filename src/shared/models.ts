export interface Note {
    id: string
    title: string
    content: string
    createdAt: Date,
    isPinned: boolean
    tags: string[]
}

export interface NoteInput {
    title: string
    content: string
    isPinned: boolean,
    tags: string[]
}

export interface Tag {
    id: string
    name: string
}