import React from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    variant?: ButtonVariant
    disabled?: boolean
    className?: string
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
