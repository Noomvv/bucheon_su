'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import PollReactions from '../../components/PollReactions'
import PollCommentList from '../../components/PollCommentList'
import PollCommentForm from '../../components/PollCommentForm'
import styles from './page.module.css'

export default function PollDetailPage() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [commentVersion, setCommentVersion] = useState(0)

  useEffect(() => {
    supabase
      .from('polls')
      .select('question, created_at')
      .eq('id', +id)
      .single()
      .then(({ data, error }) => {
        if (!error) setPoll(data)
      })
  }, [id])

  if (!poll) return <div className={styles.loading}>Загрузка…</div>

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.pollSection}>
          <div className={styles.pollHeader}>
            <h1 className={styles.pollTitle}>{poll.question}</h1>
            <small className={styles.pollDate}>
              Создано: {new Date(poll.created_at).toLocaleString()}
            </small>
          </div>
          
          <div className={styles.reactionsWrapper}>
            <PollReactions pollId={+id} />
          </div>
        </div>

        
          <PollCommentForm
            pollId={+id}
            onCommented={() => setCommentVersion(v => v + 1)}
          />
        

        
          <PollCommentList key={commentVersion} pollId={+id} />
        
      </div>
    </div>
  )
}