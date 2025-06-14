'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { ChatBubbleLeftIcon, HandThumbUpIcon, HandThumbDownIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import styles from './PollCard.module.css'

export default function PollCard({ poll }) {
  const [stats, setStats] = useState({ yes: 0, maybe: 0, no: 0 })
  const [myVote, setMyVote] = useState(0)
  const [loadingVote, setLoadingVote] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const { data: votes = [] } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', poll.id)

    setStats({
      yes: votes.filter(v => v.vote === 1).length,
      maybe: votes.filter(v => v.vote === 0).length,
      no: votes.filter(v => v.vote === -1).length,
    })

    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) return

    const { data: me } = await supabase
      .from('poll_reactions')
      .select('vote')
      .eq('poll_id', poll.id)
      .eq('user_id', sess.session.user.id)
      .single()

    setMyVote(me?.vote || 0)
  }

  async function handleReact(value) {
    setLoadingVote(true)
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) {
      alert('Пожалуйста, войдите.')
      setLoadingVote(false)
      return
    }
    const uid = sess.session.user.id

    const { data: existing } = await supabase
      .from('poll_reactions')
      .select('vote')
      .eq('poll_id', poll.id)
      .eq('user_id', uid)
      .single()

    if (existing) {
      if (existing.vote === value) {
        await supabase
          .from('poll_reactions')
          .delete()
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      } else {
        await supabase
          .from('poll_reactions')
          .update({ vote: value })
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      }
    } else {
      await supabase
        .from('poll_reactions')
        .insert({ poll_id: poll.id, user_id: uid, vote: value })
    }

    await loadStats()
    setLoadingVote(false)
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.question}>{poll.question}</h3>

      <div className={styles.actions}>
        <div className={styles.reactions}>
          <button
            disabled={loadingVote}
            className={`${styles.reaction} ${myVote === 1 ? styles.activeYes : ''}`}
            onClick={() => handleReact(1)}
          >
            <HandThumbUpIcon className={styles.icon} />
            <span>{stats.yes}</span>
          </button>
          <button
            disabled={loadingVote}
            className={`${styles.reaction} ${myVote === 0 ? styles.activeMaybe : ''}`}
            onClick={() => handleReact(0)}
          >
            <FaceSmileIcon className={styles.icon} />
            <span>{stats.maybe}</span>
          </button>
          <button
            disabled={loadingVote}
            className={`${styles.reaction} ${myVote === -1 ? styles.activeNo : ''}`}
            onClick={() => handleReact(-1)}
          >
            <HandThumbDownIcon className={styles.icon} />
            <span>{stats.no}</span>
          </button>
        </div>

        <Link href={`/Polls/${poll.id}`} className={styles.commentsLink}>
          <ChatBubbleLeftIcon className={styles.icon} />
          <span>Комментарии</span>
        </Link>
      </div>
    </div>
  )
}