import React from 'react'
import styles from './Spinner.module.css'

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large'
    color?: string
    className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ 
    size = 'medium', 
    color = 'currentColor',
    className = '' 
}) => {
    return (
        <div className={`${styles.spinner} ${styles[size]} ${className}`}>
            <div 
                className={styles.spinnerInner}
                style={{ borderTopColor: color }}
            />
        </div>
    )
}