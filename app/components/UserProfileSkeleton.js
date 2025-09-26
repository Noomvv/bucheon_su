// app/components/UserProfileSkeleton.js
'use client'

import styles from './UserProfileSkeleton.module.css'

export default function UserProfileSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.headerSkeleton}>
        <div className={styles.greetingSkeleton}></div>
        <div className={styles.nameSkeleton}></div>
        
        <div className={styles.contactInfoSkeleton}>
          <div className={styles.contactItemSkeleton}></div>
          <div className={styles.contactItemSkeleton}></div>
          <div className={styles.contactItemSkeleton}></div>
          <div className={styles.contactItemSkeleton}></div>
        </div>
      </div>
      
      <div className={styles.notificationSkeleton}></div>
    </div>
  )
}