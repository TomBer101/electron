import React, { useEffect } from 'react';
import styles from './Toast.module.css'

export enum ToastType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}

interface ToastProps {
    type: ToastType
    message: string
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export const Toast: React.FC<ToastProps> = ({
    type,
    message,
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    return (
        <div className={`${styles.toast} ${styles[type]} ${styles.show}`}>
            <div className={styles.content}>
                <span className={styles.icon}>
                    {type === ToastType.Success && '✓'}
                    {type === ToastType.Error && '✕'}
                    {type === ToastType.Info && 'ℹ'}
                    {type === ToastType.Warning && '⚠'}
                </span>
                <span className={styles.message}>{message}</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
                ×
            </button>
        </div>
    )
};

export default Toast;