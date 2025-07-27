import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Note, NoteInput } from "../../../shared/models"
import { Button } from "../common/Button"
import Toast, { ToastType } from "../common/Toast"
import { Spinner } from "../common/Spinner"
import styles from "./NoteForm.module.css"
import pinOnIcon from "../../assets/icons/pinon.svg"
import pinOffIcon from "../../assets/icons/pinoff.svg"
import { createNote, updateNote } from "../../features/notes/notesSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setSelectedTags } from "../../features/tags/tagsSlice"

export const NoteForm = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [note, setNote] = useState<Note | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPinned, setIsPinned] = useState(false)
    const selectedTags = useAppSelector(state => state.tags.selectedTags)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!!id)
    const [titleError, setTitleError] = useState<string>('')
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
                    setNote(noteData)
                    setTitle(noteData.title)
                    setContent(noteData.content)
                    setIsPinned(noteData.isPinned)
                    dispatch(setSelectedTags(noteData.tags))
                } catch (error) {
                    console.error('Error fetching note:', error)
                    showToast('Note not found', ToastType.Error)
                    navigate('/')
                } finally {
                    setIsLoading(false)
                    setIsInitialLoading(false)
                }
            }
        }
        fetchNote()
    }, [id, navigate])

    const validateTitle = (value: string): string => {
        if (!value.trim()) {
            return 'Title is required'
        }
        if (value.trim().length < 2) {
            return 'Title must be at least 2 characters long'
        }
        return ''
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setTitle(value)
        setTitleError(validateTitle(value))
    }

    const handleSave = async () => {
        if (isLoading || isInitialLoading) return
        
        const titleValidation = validateTitle(title)
        if (titleValidation) {
            setTitleError(titleValidation)
            showToast(titleValidation, ToastType.Error)
            return
        }

        setIsLoading(true)
        const noteData: NoteInput = {
            title: title.trim(),
            content: content.trim(),
            isPinned,
            tags: selectedTags
        }

        try {
            if (id) {
                const updatedNote = await dispatch(updateNote({ id, note: noteData })).unwrap()
                setNote(updatedNote)
                showToast('Note updated successfully', ToastType.Success)
            } else {
                const newNote = await dispatch(createNote(noteData)).unwrap()
                showToast('Note created successfully', ToastType.Success)
                navigate(`/notes/${newNote.id}/edit`)
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

    const handlePinToggle = () => {
        setIsPinned(!isPinned)
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

    const containerClass = `${styles.container} ${isLoading ? styles.loading : ''} ${isInitialLoading ? styles.loadingOverlay : ''}`

    return (
        <div className={containerClass}>
            {isInitialLoading && (
                <div className={styles.loadingSpinner}>
                    <Spinner size="large" />
                </div>
            )}
            
            <div className={styles.header}>
                <h1 className={styles.title}>{id ? 'Edit Note' : 'New Note'}</h1>
            </div>
            
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="title">Title *</label>
                    <input 
                        id="title"
                        type="text"
                        className={`${styles.input} ${titleError ? styles.error : ''}`}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter note title..."
                        disabled={isLoading}
                    />
                    {titleError && (
                        <div className={styles.errorMessage}>
                            <span>⚠</span>
                            {titleError}
                        </div>
                    )}
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        className={`${styles.input} ${styles.textarea}`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter note content..."
                        disabled={isLoading}
                    />
                </div>
                
                <div className={styles.pinSection}>
                    <label className={styles.pinLabel} >
                        <input
                            type="checkbox"
                            className={styles.pinCheckbox}
                            checked={isPinned}
                            onChange={handlePinToggle}
                        />
                        <img 
                            src={isPinned ? pinOnIcon : pinOffIcon} 
                            alt={isPinned ? "Pinned" : "Not pinned"}
                            className={`${styles.pinIcon} ${isPinned ? styles.pinned : styles.unpinned}`}
                        />
                        {isPinned ? 'Pinned' : 'Pin this note'}
                    </label>
                </div>
                
                {note && (
                    <div className={styles.metadata}>
                        <p className={styles.metadataText}>
                            Created: {new Date(note.createdAt).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button 
                        variant="secondary" 
                        onClick={handleCancel} 
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave} 
                        disabled={isLoading || !!titleError}
                    >
                        {isLoading ? 'Saving...' : (id ? 'Update' : 'Create')}
                    </Button>
                </div>
            </form>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}