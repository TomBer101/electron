import { useState } from 'react'
import styles from './Layout.module.css'

interface SideBarProps {
    children: React.ReactNode
    defaultExpanded?: boolean
    onToggle?: (isExpanded: boolean) => void
}

export default function SideBar({ children, defaultExpanded = true, onToggle }: SideBarProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const toggleSidebar = () => {
        const newState = !isExpanded
        setIsExpanded(newState)
        onToggle?.(newState)
    }

    return (
        <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            <button 
                className={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                <span className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
                    ◀
                </span>
            </button>
            
            <div className={`${styles.sidebarContent} ${isExpanded ? styles.expanded : styles.collapsed}`}>
                {children}
            </div>
        </div>
    )
}