// app/Ideas/page.js
'use client'

import IdeaForm from '../components/IdeaForm'
import IdeaList from '../components/IdeaList'
import styles from './page.module.css'

export default function IdeasPage() {
  return (
    <div>
      <IdeaForm onSuccess={() => {
        // React Query автоматически обновит данные через инвалидацию
      }} />

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

      <IdeaList />
    </div>
  )
}