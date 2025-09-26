// app/components/StatsPanelSkeleton.js
'use client'

import styles from './StatsPanelSkeleton.module.css'

export default function StatsPanelSkeleton() {
  return (
    <div className={styles.statsSkeleton}>
      <div className={styles.statCardSkeleton}>
        <div className={styles.statValueSkeleton}></div>
        <div className={styles.statLabelSkeleton}></div>
      </div>
      <div className={styles.statCardSkeleton}>
        <div className={styles.statValueSkeleton}></div>
        <div className={styles.statLabelSkeleton}></div>
      </div>
      <div className={styles.statCardSkeleton}>
        <div className={styles.statValueSkeleton}></div>
        <div className={styles.statLabelSkeleton}></div>
      </div>
    </div>
  )
}