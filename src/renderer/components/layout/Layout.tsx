import { useState } from 'react'
import styles from './Layout.module.css'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import TagForm from '../tags/TagForm'
import TagsList from '../tags/TagsList'

export const Layout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

    const handleSidebarToggle = (expanded: boolean) => {
        setIsSidebarExpanded(expanded)
    }

    return (
        <div className={styles.layout}>
            <SideBar 
                defaultExpanded={true}
                onToggle={handleSidebarToggle}
            >
                <TagForm />
                <TagsList />
            </SideBar>
            
            <main className={`${styles.main} ${isSidebarExpanded ? styles.withSidebar : styles.withoutSidebar}`}>
                <Outlet />
            </main>
        </div>
    )
}