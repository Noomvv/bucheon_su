'use client'

import Link from 'next/link'
import PollReactions from './PollReactions'
import styles from './PollCard.module.css'
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'

export default function PollCard({ poll }) {
  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.pollQuestion}>{poll.question}</h3>
      
      <div className={styles.footer}>
        <PollReactions pollId={poll.id} />
        
        <Link href={`/Polls/${poll.id}`} className={styles.commentsLink}>
          <ChatBubbleOvalLeftIcon className={styles.commentIcon} />
          <span>Комментарии</span>
        </Link>
      </div>
    </div>
  )
}