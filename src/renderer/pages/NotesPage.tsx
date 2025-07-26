import { useEffect, useState } from 'react'
import { Note as NoteType } from '../../shared/models'
import { Button } from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import { FloatingContainer } from '../components/common/FloatingContainer'
import { Note } from '../components/notes/Note'

export const NotesPage = () => {
    const navigate = useNavigate()
    const [notes, setNotes] = useState<NoteType[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await window.electronAPI.getNotes()
                if (response.success && response.data) {
                    setNotes(response.data)
                } else {
                    setError(response.error || 'Failed to fetch notes')
                }
            } catch (err) {
                setError('An error occurred while fetching notes')
            } finally {
                setLoading(false)
            }
        }

        fetchNotes()
    }, [])

    const handleDeleteNote = async (id: string) => {
        try {
            await window.electronAPI.deleteNote(id)
            setNotes(notes.filter(note => note.id !== id))
        } catch (err) {
            setError('An error occurred while deleting the note')
        }
    }

    const handleEditNote = async (id: string) => {
        navigate(`/notes/${id}`)
    }

    if (loading) {
        return <div>Loading notes...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="notes-page">
            <h1>Notes</h1>
            {notes.length === 0 ? (
                <p>No notes found. Create your first note!</p>
            ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                        padding: '20px'
                    }}>
                        {notes.map(note => (
                            <Note
                                key={note.id}
                                note={note}
                                onEdit={handleEditNote}
                                onDelete={handleDeleteNote}
                            />
                        ))}
                    </div>
            )}

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
