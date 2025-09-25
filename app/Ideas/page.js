// app/Ideas/page.js
'use client'

import { useState } from 'react'
import IdeaForm from '../components/IdeaForm'
import IdeaList from '../components/IdeaList'
import styles from './page.module.css'

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
      <IdeaForm onSuccess={() => setRefreshKey(k => k + 1)} />

      <div className={styles.promoWrapper}>
        <img
          src="/images/promo3.png"
          alt="Человек думает"
          className={styles.promoImageOverlap}
        />
        <div className={styles.promoBlock}>
          <div className={styles.promoText}>
            У тебя есть идея? Делись! Если она наберёт 100 лайков, мы её рассмотрим.
          </div>
        </div>
      </div>

      <IdeaList key={refreshKey} />
    </div>
  )
}