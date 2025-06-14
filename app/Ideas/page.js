// app/Ideas/page.js
'use client'

import { useState } from 'react'
import IdeaForm     from '../components/IdeaForm'
import IdeaList     from '../components/IdeaList'
import styles from './page.module.css' // Импортируем стили для страницы идей

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
        
      {/* Форма для добавления новой идеи */}
      <IdeaForm onSuccess={() => setRefreshKey(k => k + 1)} />

        <div className={styles.promoWrapper}>
            <img
            src="/images/promo3.png" // Указан правильный путь к изображению
            alt="Человек думает"
            className={styles.promoImageOverlap}/>
            <div className={styles.promoBlock}>
                <div className={styles.promoText}>У тебя есть идея? Делись! Если она наберёт 100 лайков, мы её рассмотрим.</div>
            </div>
        </div>

      {/* Список идей с пагинацией и фильтрацией */}
      <IdeaList key={refreshKey} />
    </div>
  )
}
