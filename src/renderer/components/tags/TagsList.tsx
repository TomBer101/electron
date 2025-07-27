import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchTags } from '../../features/tags/tagsSlice'
import styles from './Tag.module.css'
import Tag from './Tag'
import { Spinner } from '../common/Spinner'

const TagsList: FC = () => {
    const dispatch = useAppDispatch()
    const tags = useAppSelector(state => state.tags.tags)
    const status = useAppSelector(state => state.tags.status)

    useEffect(() => {
        dispatch(fetchTags())
    }, [dispatch])


    if (status === 'loading') {
        return <Spinner />  
    }

    return (
        <div className={styles.tagsContainer}>
            {tags.map(tag => (
                <div key={tag.id} className={styles.tag}>
                    <Tag tag={tag} />
                </div>
            ))}
        </div>
    )
}

export default TagsList
