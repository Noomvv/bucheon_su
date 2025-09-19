// app/Volunteering/page.js
'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

export default function VolunteeringPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <Image
            src="/volunteering-img/1.jpg"
            alt="Helping nature"
            width={300}
            height={200}
            className={styles.image}
          />
          <p className={styles.text}>Environmental clean-ups</p>
        </div>

        <div className={styles.card}>
          <Image
            src="/volunteering-img/2.jpg"
            alt="Helping children"
            width={300}
            height={200}
            className={styles.image}
          />
          <p className={styles.text}>Supporting local communities</p>
        </div>
        
      </div>

        <div className={styles.promoWrapper}>
            <img
            src="/images/promo3.png" // Указан правильный путь к изображению
            alt="Человек думает"
            className={styles.promoImageOverlap}/>
            <div className={styles.promoBlock}>
                <div className={styles.promoText}>Участвуй в студенческих волонтёрских проектах, получай новый опыт и помогай другим.</div>
            </div>
        </div>

      <button className={styles.button}>
        Стать волонтёром
      </button>
    </div>
  )
}