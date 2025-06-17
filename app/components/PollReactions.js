'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import { HandThumbUpIcon, HandThumbDownIcon, ScaleIcon } from '@heroicons/react/24/outline'
import styles                  from './PollReactions.module.css'

export default function PollReactions({ pollId }) {
  const STORAGE_KEY = `pollReactions-${pollId}`

  const [counts, setCounts]       = useState({ yes:0, maybe:0, no:0 })
  const [myVote, setMyVote]       = useState(null)
  const [loading, setLoading]     = useState(true)

  // Helper to persist to sessionStorage
  const persist = (counts, vote) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ counts, myVote: vote })
      )
    } catch {}
  }

  useEffect(() => {
    // 1) Try reading from sessionStorage
    try {
      const json = sessionStorage.getItem(STORAGE_KEY)
      if (json) {
        const { counts: savedCounts, myVote: savedVote } = JSON.parse(json)
        setCounts(savedCounts)
        setMyVote(savedVote)
        setLoading(false)
      }
    } catch {}

    // 2) Always re-fetch in background
    (async () => {
      const { data: votes = [] } = await supabase
        .from('poll_reactions')
        .select('vote, user_id')
        .eq('poll_id', pollId)

      const newCounts = {
        yes:   votes.filter(v => v.vote === 1).length,
        maybe: votes.filter(v => v.vote === 0).length,
        no:    votes.filter(v => v.vote === -1).length,
      }

      const { data: { session }} = await supabase.auth.getSession()
      let newMyVote = null
      if (session) {
        const { data: me } = await supabase
          .from('poll_reactions')
          .select('vote')
          .eq('poll_id', pollId)
          .eq('user_id', session.user.id)
          .single()
        newMyVote = me?.vote ?? null
      }

      setCounts(newCounts)
      setMyVote(newMyVote)
      setLoading(false)
      persist(newCounts, newMyVote)
    })()
  }, [pollId])

  if (loading) {
    // avoid flicker: show nothing (or skeleton) until we at least hydrate from storage
    return <div className={styles.skeleton} />
  }

  const handleVote = async v => {
    const { data: { session }} = await supabase.auth.getSession()
    if (!session) {
      // do nothing if not logged in
      return
    }
    const userId = session.user.id
    const next   = myVote === v ? null : v

    // Optimistic counts
    setCounts(c => {
      const upd = { ...c }
      // remove old
      if      (myVote === 1)   upd.yes--
      else if (myVote === 0)   upd.maybe--
      else if (myVote === -1)  upd.no--
      // add new
      if      (next === 1)     upd.yes++
      else if (next === 0)     upd.maybe++
      else if (next === -1)    upd.no++
      return upd
    })
    setMyVote(next)
    persist(counts, next)

    // Sync to Supabase
    if (next === null) {
      await supabase
        .from('poll_reactions')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', userId)
    } else {
      await supabase
        .from('poll_reactions')
        .upsert(
          { poll_id: pollId, user_id: userId, vote: next },
          { onConflict: ['poll_id','user_id'] }
        )
    }
  }

  // If user isn’t logged in we want the buttons inert
  const disabled = loading || !supabase.auth.getSession

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${myVote === 1 ? styles.activeYes : ''}`}
        onClick={() => handleVote(1)}
        disabled={!sessionStorage}  // visually disable if no session support
      >
        <HandThumbUpIcon className={styles.icon}/>
        <span className={styles.count}>{counts.yes}</span>
      </button>

      <button
        className={`${styles.button} ${myVote === 0 ? styles.activeMaybe : ''}`}
        onClick={() => handleVote(0)}
        disabled={!sessionStorage}
      >
        <ScaleIcon className={styles.icon}/>
        <span className={styles.count}>{counts.maybe}</span>
      </button>

      <button
        className={`${styles.button} ${myVote === -1 ? styles.activeNo : ''}`}
        onClick={() => handleVote(-1)}
        disabled={!sessionStorage}
      >
        <HandThumbDownIcon className={styles.icon}/>
        <span className={styles.count}>{counts.no}</span>
      </button>
    </div>
  )
}
