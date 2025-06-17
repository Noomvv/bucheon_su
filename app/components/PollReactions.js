'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  HandThumbUpIcon,
  HandThumbDownIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'
import styles from './PollReactions.module.css'

export default function PollReactions({ pollId }) {
  const [counts, setCounts] = useState({ yes: 0, maybe: 0, no: 0 })
  const [myVote, setMyVote] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchVotes = async () => {
      // Загрузка текущих голосов
      const { data: votes = [] } = await supabase
        .from('poll_reactions')
        .select('vote, user_id')
        .eq('poll_id', pollId)

      setCounts({
        yes: votes.filter(v => v.vote === 1).length,
        maybe: votes.filter(v => v.vote === 0).length,
        no: votes.filter(v => v.vote === -1).length,
      })

      // Проверка текущего голоса пользователя
      const { data: sess } = await supabase.auth.getSession()
      if (sess.session) {
        const { data: myVote } = await supabase
          .from('poll_reactions')
          .select('vote')
          .eq('poll_id', pollId)
          .eq('user_id', sess.session.user.id)
          .single()
        setMyVote(myVote?.vote ?? null)
      }
      setLoaded(true)
    }

    fetchVotes()
  }, [pollId])

  if (!loaded) return null

  const handleVote = async (vote) => {
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) {
      alert('Для голосования необходимо войти в систему')
      return
    }

    const userId = sess.session.user.id
    const newVote = myVote === vote ? null : vote

    // Оптимистичное обновление
    setCounts(prev => ({
      yes: prev.yes + (newVote === 1 ? 1 : 0) - (myVote === 1 ? 1 : 0),
      maybe: prev.maybe + (newVote === 0 ? 1 : 0) - (myVote === 0 ? 1 : 0),
      no: prev.no + (newVote === -1 ? 1 : 0) - (myVote === -1 ? 1 : 0),
    }))
    setMyVote(newVote)

    // Синхронизация с базой данных
    if (newVote === null) {
      await supabase
        .from('poll_reactions')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', userId)
    } else {
      await supabase
        .from('poll_reactions')
        .upsert(
          { poll_id: pollId, user_id: userId, vote: newVote },
          { onConflict: ['poll_id', 'user_id'] }
        )
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${myVote === 1 ? styles.activeYes : ''}`}
        onClick={() => handleVote(1)}
        aria-label="Голосовать За"
      >
        <HandThumbUpIcon className={styles.icon} />
        <span className={styles.count}>{counts.yes}</span>
      </button>

      <button
        className={`${styles.button} ${myVote === 0 ? styles.activeMaybe : ''}`}
        onClick={() => handleVote(0)}
        aria-label="Голосовать Возможно"
      >
        <ScaleIcon className={styles.icon} />
        <span className={styles.count}>{counts.maybe}</span>
      </button>

      <button
        className={`${styles.button} ${myVote === -1 ? styles.activeNo : ''}`}
        onClick={() => handleVote(-1)}
        aria-label="Голосовать Против"
      >
        <HandThumbDownIcon className={styles.icon} />
        <span className={styles.count}>{counts.no}</span>
      </button>
    </div>
  )
}