// app/components/PollList.js
'use client'

import { usePolls } from '../hooks/usePolls'
import PollCard from './PollCard'
import styles from './PollList.module.css'

export default function PollList() {
  const { data: polls, isLoading, error } = usePolls()

  if (isLoading) {
    return (
      <div className={styles.listContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonDate}></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    console.error('Error loading polls:', error)
    return (
      <div className={styles.emptyState}>
        Ошибка загрузки опросов
      </div>
    )
  }

  if (!polls || polls.length === 0) {
    return (
      <div className={styles.emptyState}>
        Пока нет ни одного опроса
      </div>
    )
  }

  return (
    <div className={styles.listContainer}>
      {polls.map(p => (
        <PollCard key={p.id} poll={p} />
      ))}
    </div>
  )
}