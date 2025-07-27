import { FC, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createTag, setError } from '../../features/tags/tagsSlice'
import { Tag } from '../../../shared/models'
import styles from './Tag.module.css'
import Toast, { ToastType } from '../common/Toast'


const TagForm: FC = () => {
    const [tagName, setTagName] = useState('')
    const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.tags.error)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tagName.trim()) return

        const newTag: Omit<Tag, 'id'> = {
            name: tagName.trim()
        }
        try {
            await dispatch(createTag(newTag)).unwrap()
            setTagName('') // Clear input on success
        } catch (error) {
            console.error('Failed to create tag:', error instanceof Error ? error.message : error)

        }
    }

    return (
        <div>
        <form onSubmit={handleSubmit} className={styles.tagForm}>
            <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
                className={styles.tagInput}
            />
            <button 
                type="submit"
                className={styles.addButton}
                disabled={!tagName.trim()}
            >
                Add Tag
            </button>
        </form>
        <Toast 
        message={error || ''} type={ToastType.Error} isVisible={!!error} onClose={() => dispatch(setError(null))} />
        </div>
    )
}

export default TagForm
