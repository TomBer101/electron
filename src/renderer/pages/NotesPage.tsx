import { useEffect, useState, useMemo } from 'react'
import { Button } from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import { FloatingContainer } from '../components/common/FloatingContainer'
import { Note } from '../components/notes/Note'
import Toast, { ToastType } from '../components/common/Toast'
import { SearchInput } from '../components/common/SearchInput'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { deleteNote, fetchNotes } from '../features/notes/notesSlice'
import { setSelectedTags } from '../features/tags/tagsSlice'
import styles from './NotesPage.module.css'
import { Spinner } from '../components/common/Spinner'

export const NotesPage = () => {
    const dispatch = useAppDispatch()
    const { notes, status, error } = useAppSelector(state => state.notes)
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [toast, setToast] = useState<{
        message: string
        type: ToastType
        isVisible: boolean
    } | null>(null)

    useEffect(() => {
        dispatch(fetchNotes())
    }, [dispatch])

    useEffect(() => {
        dispatch(setSelectedTags([]))
    }, [])

    const filteredNotes = useMemo(() => {
        if (!searchTerm.trim()) {
            return notes
        }
        
        const searchLower = searchTerm.toLowerCase()
        return notes.filter(note => 
            note.title.toLowerCase().includes(searchLower) ||
            note.content.toLowerCase().includes(searchLower)
        )
    }, [notes, searchTerm])

    const handleDeleteNote = async (id: string) => {
        try {
            setToast({
                message: 'Note deleted successfully',
                type: ToastType.Success,
                isVisible: true
            })
            dispatch(deleteNote(id))
        } catch (err) {
            setToast({
                message: 'An error occurred while deleting the note',
                type: ToastType.Error,
                isVisible: true
            })
        }
    }

    const handleEditNote = async (id: string) => {
        navigate(`/notes/${id}/edit`)
    }

    if (status === 'loading') {
        return <Spinner size="large" />
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className={styles['notes-page']}>
            <div className={styles.header}>
                <h1 className={styles.title}>Notes</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search notes by title or content..."
                />
            </div>
            

            {filteredNotes.length === 0 ? (
                <div className={styles['empty-state']}>
                    {searchTerm.trim() ? (
                        <p>No notes found matching "{searchTerm}". Try a different search term.</p>
                    ) : (
                        <p>No notes found. Create your first note!</p>
                    )}
                </div>
            ) : (
                <div className={styles['notes-grid']}>
                    {filteredNotes.map(note => (
                        <Note
                            key={note.id}
                            note={note}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                        />
                    ))}
                </div>
            )}

            <Toast 
                type={toast?.type || ToastType.Info}
                message={toast?.message || ''}
                isVisible={toast?.isVisible || false}
                onClose={() => setToast(null)}
            />

            <FloatingContainer
                position="bottom-right"
                direction="vertical"
                gap={10}
            >
                <Button variant="primary" onClick={() => navigate('/notes/new')}>Create Note</Button>
            </FloatingContainer>
        </div>
    )
}

export default NotesPage
