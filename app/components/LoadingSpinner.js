// app/components/LoadingSpinner.js
'use client'

import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  )
}