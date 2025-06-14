'use client'

import styles from './StatsPanel.module.css'

export default function StatsPanel({ ideasCount, totalLikes, rank }) {
  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{ideasCount}</div>
        <div className={styles.statLabel}>Предложено идей</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{totalLikes}</div>
        <div className={styles.statLabel}>Всего лайков</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{rank || '—'}</div>
        <div className={styles.statLabel}>Место в рейтинге</div>
      </div>
    </div>
  )
}