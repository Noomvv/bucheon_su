// app/polls/page.js
'use client'

import AddPollButton from '../components/AddPollButton'
import PollList from '../components/PollList'
import styles from './page.module.css'

export default function PollsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PollList />
        <div className={styles.promoWrapper}>
            <img
            src="/images/promo4.png" // Указан правильный путь к изображению
            alt="Человек думает"
            className={styles.promoImageOverlap}/>
            <div className={styles.promoBlock}>
                <div className={styles.promoText}>Опросы от студсовета — голосуй с реакциями и делись мнением в комментариях.</div>
            </div>
        </div>
        <AddPollButton />
      </div>
    </div>
  )
}