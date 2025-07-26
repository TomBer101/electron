export interface Note {
    id: string
    title: string
    content: string
    createdAt: Date,
    isPinned: boolean
    tags: Tag[]
}

export interface NoteInput {
    title: string
    content: string
    isPinned: boolean,
    tags: Tag[]
}

export interface Tag {
    id: string
    name: string
}