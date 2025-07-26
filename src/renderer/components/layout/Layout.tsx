import React, { useState } from 'react'
import styles from './Layout.module.css'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>

            </div>
            <main className={styles.main}>
                <Outlet />
            </main>

        </div>
    )
}