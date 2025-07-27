import React, { useEffect, useRef, useState } from 'react';
import { Note as NoteType } from '../../../shared/models';
import { FloatingContainer } from '../common/FloatingContainer';

import styles from './Note.module.css';
import PinIcon from '../../assets/icons/pinOn.svg?react';
import EditIcon from '../../assets/icons/edit.svg?react';
import DeleteIcon from '../../assets/icons/delete.svg?react';
import { togglePinNote } from '../../features/notes/notesSlice';
import { useAppDispatch } from '../../app/hooks';

interface NoteProps {
    note: NoteType;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const Note: React.FC<NoteProps> = ({ note, onDelete, onEdit }) => {
    const dispatch = useAppDispatch()
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showReadMore, setShowReadMore] = useState<boolean>(false);
    const [isPinned, setIsPinned] = useState<boolean>(note.isPinned);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const element = contentRef.current;
            const isTruncated = element.scrollHeight > element.clientHeight;
            setShowReadMore(isTruncated);
        }
    }, [note.content]);
    
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleTogglePin = async (id: string) => {
        try {
            dispatch(togglePinNote(id))  
            setIsPinned(!isPinned)
        } catch (err) {
            console.error('Error toggling pin:', err)
        }
    }

    const getContentPreview = () => {
        return (
            <>
                {!isExpanded ? (
                    <div className={styles.contentPreview}>
                        <div className={styles.clampedContent} ref={contentRef}>
                            {note.content}
                        </div>
                        {showReadMore && (
                            <button 
                                className={styles.readMoreBtn}
                                onClick={() => setIsExpanded(true)}
                            >
                                Read more...
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.fullContent}>
                        {note.content}
                        <button 
                            className={styles.readLessBtn}
                            onClick={() => setIsExpanded(false)}
                        >
                            Show less
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.noteContainer}>
            <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <button 
                    className={styles.iconButton}
                    onClick={() => handleTogglePin(note.id)}
                    title="Toggle pin"
                >
                    <PinIcon style={{fill: isPinned ? 'green' : 'red',}}/>
                </button>
            </div>
            
            <small className={styles.dateText}>
                {formatDate(note.createdAt)}
            </small>
            
            <div className={styles.noteContent}>
                {getContentPreview()}
            </div>

            <FloatingContainer position="bottom-right" gap={8}>
                <button 
                    className={styles.iconButton}
                    onClick={() => onEdit?.(note.id)}
                    title="Edit note"
                >
                    <EditIcon />
                </button>
                <button 
                    className={styles.iconButton}
                    onClick={() => onDelete?.(note.id)}
                    title="Delete note"
                >
                    <DeleteIcon />
                </button>
            </FloatingContainer>
        </div>
    );
};
