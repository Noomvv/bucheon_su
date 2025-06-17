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
  const [loading, setLoading] = useState(true) // Добавлено состояние загрузки

  useEffect(() => {
    supabase
      .from('polls')
      .select('question, created_at')
      .eq('id', +id)
      .single()
      .then(({ data, error }) => {
        if (!error) setPoll(data)
        setLoading(false) // Завершаем состояние загрузки
      })
  }, [id])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonPoll}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonDate}></div>
          <div className={styles.skeletonReactions}></div>
        </div>
      </div>
    )
  }

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