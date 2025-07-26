import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Note, NoteInput } from "../../../shared/models"
import { Tag } from "../../../shared/models"
import { Button } from "../common/Button"
import { Spinner } from "../common/Spinner"
import Toast, { ToastType } from "../common/Toast"
import { FloatingContainer } from "../common/FloatingContainer"

export const NoteForm = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [note, setNote] = useState<Note | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPinned, setIsPinned] = useState(false)
    const [tags, setTags] = useState<Tag[]>([]) // should be derrived from the store

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!!id)
    const [toast, setToast] = useState<{
        message: string
        type: ToastType
        isVisible: boolean
    }>({
        message: '',
        type: ToastType.Info,
        isVisible: false
    })

    useEffect(() => {
        const fetchNote = async () => {
            if (id) {
                setIsLoading(true)
                try {
                    const noteData = await window.electronAPI.getNoteById(id)
                    if (noteData) {
                        setNote(noteData)
                        setTitle(noteData.title)
                        setContent(noteData.content)
                        setIsPinned(noteData.isPinned)
                        setTags(noteData.tags)
                    } else {
                        showToast('Note not found', ToastType.Error)
                        navigate('/')
                    }
                } catch (error) {
                    console.error('Error fetching note:', error)
                    showToast('Error fetching note', ToastType.Error)
                    navigate('/')
                } finally {
                    setIsLoading(false)
                    setIsInitialLoading(false)
                }
            }
        }
        fetchNote()
    }, [id, navigate])

    const handleSave = async () => {
        if (isLoading) return
        if (!title.trim()) {
            showToast('Title is required', ToastType.Error)
            return
        }

        setIsLoading(true)
        const noteData: NoteInput = {
            title,
            content,
            isPinned,
            tags
        }

        try {
            if (id) {
                await window.electronAPI.updateNote(id, noteData)
                showToast('Note updated successfully', ToastType.Success)
            } else {
                const {data: newNote} = await window.electronAPI.createNote(noteData)
                showToast('Note created successfully', ToastType.Success)
                if (newNote && newNote.id) {
                    navigate(`/notes/${newNote.id}/edit`)
                }
            }

            setTimeout(() => {
                navigate('/')
            }, 2500)
        } catch (error) {
            console.error('Error saving note:', error)
            showToast('Error saving note', ToastType.Error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    const showToast = (message: string, type: ToastType) => {
        setToast({
            message,
            type,
            isVisible: true
        })
    }

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }))
    }

    return (
        <div>
            <h1>{id ? 'Edit Note' : 'New Note'}</h1>
            <form>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPinned}
                            onChange={(e) => setIsPinned(e.target.checked)}
                        />
                        Pinned
                    </label>
                </div>
                {note && (
                    <div>
                        <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                )}

            </form>

            <FloatingContainer
                position="bottom-right"
                gap={10}
            >
                <Button variant="primary" onClick={handleSave} disabled={isLoading}>Save</Button>
                <Button variant="danger" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
            </FloatingContainer>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}