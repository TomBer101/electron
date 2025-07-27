import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Tag as TagType } from '../../../shared/models'
import { selectSelectedTags } from '../../features/tags/tagsSelector'
import { deleteTag, setSelectedTags } from '../../features/tags/tagsSlice'
import styles from './Tag.module.css'

interface TagProps {
    tag: TagType
}



const Tag: FC<TagProps> = ({ tag }) => {
    const dispatch = useAppDispatch()
    const selectedTags = useAppSelector(selectSelectedTags)
    const isSelected = selectedTags.some(t => t === tag.id)

    const handleClick = () => {
        dispatch(setSelectedTags(tag.id))
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(deleteTag(tag.id))
    }

    return (
        <div className={`${styles.tag} ${isSelected ? styles.selected : ''}`} onClick={handleClick}>
            {tag.name}
            <button 
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label="Delete tag"
            >
                ×
            </button>
        </div>
    )
}

export default Tag
