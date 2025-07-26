import React from 'react'
import styles from './FloatingContainer.module.css'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type Direction = 'horizontal' | 'vertical'

interface FloatingContainerProps {
    position: Position
    direction?: Direction
    gap?: number
    children: React.ReactNode
    className?: string
}

export const FloatingContainer: React.FC<FloatingContainerProps> = ({
    position,
    direction = 'horizontal',
    gap = 10,
    children,
    className = ''
}) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: `${gap}px`,
    }

    return (
        <div className={`${styles.floatingContainer} ${styles[position]} ${className}`} style={containerStyle}>
            {children}
        </div>
    )
}