// components/Alert.js
'use client'

import styles from './Alert.module.css'

export default function Alert({ children }) {
  return (
    <div className={styles.alert}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}