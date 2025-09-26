// app/components/VolunteerMessageSkeleton.js
'use client'

import styles from './VolunteerMessageSkeleton.module.css'

export default function VolunteerMessageSkeleton() {
  return (
    <div className={styles.messageSkeleton}>
      <div className={styles.messageContentSkeleton}></div>
    </div>
  )
}