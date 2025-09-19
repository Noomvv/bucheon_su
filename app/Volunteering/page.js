// app/Volunteering/page.js
'use client'

import { useState } from 'react'
import styles from './page.module.css' // Импортируем стили для страницы идей

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
        <h1 className={styles.header}>Волонтёрство</h1>
    </div>
  )
}
