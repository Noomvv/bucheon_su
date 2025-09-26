// app/components/IdeaVoting.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'
import styles from './IdeaList.module.css'

export default function IdeaVoting({ ideaId }) {
  const STORAGE_KEY = `ideaVotes-${ideaId}`

  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [myVote, setMyVote] = useState(0)
  const [loading, setLoading] = useState(true)

  // Helper to persist to sessionStorage
  const persist = (likes, dislikes, vote) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ likes, dislikes, myVote: vote })
      )
    } catch {}
  }

  useEffect(() => {
    // 1) Try reading from sessionStorage
    try {
      const json = sessionStorage.getItem(STORAGE_KEY)
      if (json) {
        const { likes: savedLikes, dislikes: savedDislikes, myVote: savedVote } = JSON.parse(json)
        setLikes(savedLikes)
        setDislikes(savedDislikes)
        setMyVote(savedVote)
        setLoading(false)
      }
    } catch {}

    // 2) Always re-fetch in background
    (async () => {
      const { data: votes = [] } = await supabase
        .from('idea_votes')
        .select('vote, user_id')
        .eq('idea_id', ideaId)

      const newLikes = votes.filter(v => v.vote === 1).length
      const newDislikes = votes.filter(v => v.vote === -1).length

      const { data: { session }} = await supabase.auth.getSession()
      let newMyVote = 0
      if (session) {
        const { data: me } = await supabase
          .from('idea_votes')
          .select('vote')
          .eq('idea_id', ideaId)
          .eq('user_id', session.user.id)
          .single()
        newMyVote = me?.vote || 0
      }

      setLikes(newLikes)
      setDislikes(newDislikes)
      setMyVote(newMyVote)
      setLoading(false)
      persist(newLikes, newDislikes, newMyVote)
    })()
  }, [ideaId])

  const handleVote = async (voteValue) => {
    const { data: { session }} = await supabase.auth.getSession()
    if (!session) {
      alert('Чтобы голосовать, пожалуйста, войдите или зарегистрируйтесь.')
      return
    }

    const userId = session.user.id
    const nextVote = myVote === voteValue ? 0 : voteValue

    // Optimistic update
    if (myVote === voteValue) {
      // Remove vote
      if (voteValue === 1) setLikes(l => l - 1)
      else setDislikes(d => d - 1)
      setMyVote(0)
      persist(likes - (voteValue === 1 ? 1 : 0), dislikes - (voteValue === -1 ? 1 : 0), 0)
    } else {
      // Add or change vote
      if (myVote === 0) {
        // New vote
        if (voteValue === 1) setLikes(l => l + 1)
        else setDislikes(d => d + 1)
      } else {
        // Change vote
        if (voteValue === 1) {
          setLikes(l => l + 1)
          setDislikes(d => d - 1)
        } else {
          setDislikes(d => d + 1)
          setLikes(l => l - 1)
        }
      }
      setMyVote(nextVote)
      persist(
        likes + (voteValue === 1 ? 1 : (myVote === -1 && voteValue === 0 ? -1 : 0)),
        dislikes + (voteValue === -1 ? 1 : (myVote === 1 && voteValue === 0 ? -1 : 0)),
        nextVote
      )
    }

    // Sync to Supabase
    if (nextVote === 0) {
      await supabase
        .from('idea_votes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('user_id', userId)
    } else {
      await supabase
        .from('idea_votes')
        .upsert(
          { idea_id: ideaId, user_id: userId, vote: nextVote },
          { onConflict: ['idea_id', 'user_id'] }
        )
    }
  }

  if (loading) {
    return (
      <div className={styles.voteButtons}>
        <button className={styles.voteButton} disabled>
          <HandThumbUpIcon className={styles.icon}/>
          <span className={styles.voteCount}>-</span>
        </button>
        <button className={styles.voteButton} disabled>
          <HandThumbDownIcon className={styles.icon}/>
          <span className={styles.voteCount}>-</span>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.voteButtons}>
      <button
        className={`${styles.voteButton} ${styles.likeButton} ${myVote === 1 ? styles.active : ''}`}
        onClick={() => handleVote(1)}
        aria-label="Поддержать идею"
      >
        <HandThumbUpIcon className={styles.icon}/>
        <span className={styles.voteCount}>{likes}</span>
      </button>
      <button
        className={`${styles.voteButton} ${styles.dislikeButton} ${myVote === -1 ? styles.active : ''}`}
        onClick={() => handleVote(-1)}
        aria-label="Не поддерживаю идею"
      >
        <HandThumbDownIcon className={styles.icon}/>
        <span className={styles.voteCount}>{dislikes}</span>
      </button>
    </div>
  )
}