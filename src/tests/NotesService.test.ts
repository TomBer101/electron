import { NotesService } from '../electron/services/NotesService'
import { INoteRepository } from '../electron/repositories/interfaces/INoteRepository'
import { Note, NoteInput, Tag } from '../shared/models'
import { NoteNotFoundError, NoteValidationFailedError } from '../electron/errors/NoteNotFoundError'

// Mock data
const mockTags: Tag[] = [
    { id: 'tag1', name: 'work' },
    { id: 'tag2', name: 'personal' },
    { id: 'tag3', name: 'important' }
]

const mockNotes: Note[] = [
    {
        id: 'note1',
        title: 'Test Note 1',
        content: 'This is the content of test note 1',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        isPinned: false,
        tags: [mockTags[0]]
    },
    {
        id: 'note2',
        title: 'Test Note 2',
        content: 'This is the content of test note 2',
        createdAt: new Date('2024-01-02T11:00:00Z'),
        isPinned: true,
        tags: [mockTags[1], mockTags[2]]
    },
    {
        id: 'note3',
        title: 'Test Note 3',
        content: 'This is the content of test note 3',
        createdAt: new Date('2024-01-03T12:00:00Z'),
        isPinned: false,
        tags: []
    }
]

// Mock repository implementation
const createMockNoteRepository = (): jest.Mocked<INoteRepository> => ({
    getNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    searchNotes: jest.fn(),
    getNoteById: jest.fn()
})

describe('NotesService', () => {
    let notesService: NotesService
    let mockRepository: jest.Mocked<INoteRepository>

    beforeEach(() => {
        mockRepository = createMockNoteRepository()
        notesService = new NotesService(mockRepository)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getNotes', () => {
        it('should return all notes from repository', async () => {
            // Arrange
            mockRepository.getNotes.mockResolvedValue(mockNotes)

            // Act
            const result = await notesService.getNotes()

            // Assert
            expect(mockRepository.getNotes).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockNotes)
        })

        it('should handle empty notes array', async () => {
            // Arrange
            mockRepository.getNotes.mockResolvedValue([])

            // Act
            const result = await notesService.getNotes()

            // Assert
            expect(mockRepository.getNotes).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })
    })

    describe('getNoteById', () => {
        it('should return note when valid ID is provided', async () => {
            // Arrange
            const noteId = 'note1'
            const expectedNote = mockNotes[0]
            mockRepository.getNoteById.mockResolvedValue(expectedNote)

            // Act
            const result = await notesService.getNoteById(noteId)

            // Assert
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(result).toEqual(expectedNote)
        })

        it('should return null when note is not found', async () => {
            // Arrange
            const noteId = 'nonexistent'
            mockRepository.getNoteById.mockResolvedValue(null)

            // Act
            const result = await notesService.getNoteById(noteId)

            // Assert
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(result).toBeNull()
        })

        it('should throw error when ID is empty string', async () => {
            // Arrange
            const noteId = ''

            // Act & Assert
            await expect(notesService.getNoteById(noteId)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.getNoteById(noteId)).rejects.toThrow('Note ID is required')
            expect(mockRepository.getNoteById).not.toHaveBeenCalled()
        })

        it('should throw error when ID is not a string', async () => {
            // Arrange
            const noteId = null as unknown as string

            // Act & Assert
            await expect(notesService.getNoteById(noteId)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.getNoteById(noteId)).rejects.toThrow('Note ID is required')
            expect(mockRepository.getNoteById).not.toHaveBeenCalled()
        })
    })

    describe('createNote', () => {
        it('should create note with valid input', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: [mockTags[0]]
            }
            const expectedNote: Note = {
                id: 'new-note-id',
                ...noteInput,
                createdAt: new Date()
            }
            mockRepository.createNote.mockResolvedValue(expectedNote)

            // Act
            const result = await notesService.createNote(noteInput)

            // Assert
            expect(mockRepository.createNote).toHaveBeenCalledWith({
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: [mockTags[0]]
            })
            expect(result).toEqual(expectedNote)
        })

        it('should sanitize input by trimming whitespace', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: '  New Note  ',
                content: '  New note content  ',
                isPinned: false,
                tags: []
            }
            const expectedNote: Note = {
                id: 'new-note-id',
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: [],
                createdAt: new Date()
            }
            mockRepository.createNote.mockResolvedValue(expectedNote)

            // Act
            const result = await notesService.createNote(noteInput)

            // Assert
            expect(mockRepository.createNote).toHaveBeenCalledWith({
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: []
            })
            expect(result).toEqual(expectedNote)
        })

        it('should set default values for optional fields', async () => {
            // Arrange
            const noteInput = {
                title: 'New Note',
                content: 'New note content'
            } as NoteInput
            const expectedNote: Note = {
                id: 'new-note-id',
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: [],
                createdAt: new Date()
            }
            mockRepository.createNote.mockResolvedValue(expectedNote)

            // Act
            const result = await notesService.createNote(noteInput)

            // Assert
            expect(mockRepository.createNote).toHaveBeenCalledWith({
                title: 'New Note',
                content: 'New note content',
                isPinned: false,
                tags: []
            })
            expect(result).toEqual(expectedNote)
        })

        it('should throw error when title is empty', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: '',
                content: 'Some content',
                isPinned: false,
                tags: []
            }

            // Act & Assert
            await expect(notesService.createNote(noteInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.createNote(noteInput)).rejects.toThrow('Title is required')
            expect(mockRepository.createNote).not.toHaveBeenCalled()
        })

        it('should throw error when title is only whitespace', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: '   ',
                content: 'Some content',
                isPinned: false,
                tags: []
            }

            // Act & Assert
            await expect(notesService.createNote(noteInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.createNote(noteInput)).rejects.toThrow('Title is required')
            expect(mockRepository.createNote).not.toHaveBeenCalled()
        })

        it('should throw error when content is empty', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: 'Some title',
                content: '',
                isPinned: false,
                tags: []
            }

            // Act & Assert
            await expect(notesService.createNote(noteInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.createNote(noteInput)).rejects.toThrow('Content is required')
            expect(mockRepository.createNote).not.toHaveBeenCalled()
        })

        it('should throw error when content is only whitespace', async () => {
            // Arrange
            const noteInput: NoteInput = {
                title: 'Some title',
                content: '   ',
                isPinned: false,
                tags: []
            }

            // Act & Assert
            await expect(notesService.createNote(noteInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.createNote(noteInput)).rejects.toThrow('Content is required')
            expect(mockRepository.createNote).not.toHaveBeenCalled()
        })
    })

    describe('updateNote', () => {
        it('should update note with valid input', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = {
                title: 'Updated Title',
                content: 'Updated content'
            }
            const existingNote = mockNotes[0]
            const updatedNote: Note = {
                ...existingNote,
                title: 'Updated Title',
                content: 'Updated content'
            }
            mockRepository.getNoteById.mockResolvedValue(existingNote)
            mockRepository.updateNote.mockResolvedValue(updatedNote)

            // Act
            const result = await notesService.updateNote(noteId, updateInput)

            // Assert
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
                title: 'Updated Title',
                content: 'Updated content'
            })
            expect(result).toEqual(updatedNote)
        })

        it('should sanitize input by trimming whitespace', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = {
                title: '  Updated Title  ',
                content: '  Updated content  '
            }
            const existingNote = mockNotes[0]
            const updatedNote: Note = {
                ...existingNote,
                title: 'Updated Title',
                content: 'Updated content'
            }
            mockRepository.getNoteById.mockResolvedValue(existingNote)
            mockRepository.updateNote.mockResolvedValue(updatedNote)

            // Act
            const result = await notesService.updateNote(noteId, updateInput)

            // Assert
            expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
                title: 'Updated Title',
                content: 'Updated content'
            })
            expect(result).toEqual(updatedNote)
        })

        it('should handle partial updates', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = {
                isPinned: true
            }
            const existingNote = mockNotes[0]
            const updatedNote: Note = {
                ...existingNote,
                isPinned: true
            }
            mockRepository.getNoteById.mockResolvedValue(existingNote)
            mockRepository.updateNote.mockResolvedValue(updatedNote)

            // Act
            const result = await notesService.updateNote(noteId, updateInput)

            // Assert
            expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
                isPinned: true
            })
            expect(result).toEqual(updatedNote)
        })

        it('should throw error when ID is invalid', async () => {
            // Arrange
            const noteId = ''
            const updateInput = { title: 'Updated Title' }

            // Act & Assert
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow('Note ID is required')
            expect(mockRepository.getNoteById).not.toHaveBeenCalled()
            expect(mockRepository.updateNote).not.toHaveBeenCalled()
        })

        it('should throw error when note is not found', async () => {
            // Arrange
            const noteId = 'nonexistent'
            const updateInput = { title: 'Updated Title' }
            mockRepository.getNoteById.mockResolvedValue(null)

            // Act & Assert
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow(NoteNotFoundError)
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow(`Note with ID ${noteId} not found`)
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(mockRepository.updateNote).not.toHaveBeenCalled()
        })

        it('should throw error when title is empty', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = { title: '' }
            const existingNote = mockNotes[0]
            mockRepository.getNoteById.mockResolvedValue(existingNote)

            // Act & Assert
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow('Note title cannot be empty!')
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(mockRepository.updateNote).not.toHaveBeenCalled()
        })

        it('should throw error when content is empty', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = { content: '' }
            const existingNote = mockNotes[0]
            mockRepository.getNoteById.mockResolvedValue(existingNote)

            // Act & Assert
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow(NoteValidationFailedError)
            await expect(notesService.updateNote(noteId, updateInput)).rejects.toThrow('Note content cannot be empty!')
            expect(mockRepository.getNoteById).toHaveBeenCalledWith(noteId)
            expect(mockRepository.updateNote).not.toHaveBeenCalled()
        })

        it('should return null when repository returns null', async () => {
            // Arrange
            const noteId = 'note1'
            const updateInput = { title: 'Updated Title' }
            const existingNote = mockNotes[0]
            mockRepository.getNoteById.mockResolvedValue(existingNote)
            mockRepository.updateNote.mockResolvedValue(null)

            // Act
            const result = await notesService.updateNote(noteId, updateInput)

            // Assert
            expect(result).toBeNull()
        })
    })
}) 