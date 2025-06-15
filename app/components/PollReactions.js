// app/components/PollReactions.js
'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'

export default function PollReactions({ pollId }) {
  const [counts, setCounts] = useState({ yes: 0, maybe: 0, no: 0 })
  const [myVote, setMyVote] = useState(null)  // null = no vote

  useEffect(() => {
    ;(async () => {
      // 1) Load all votes
      const { data: votes = [] } = await supabase
        .from('poll_reactions')
        .select('vote, user_id')
        .eq('poll_id', pollId)

      setCounts({
        yes:   votes.filter(v => v.vote === 1).length,
        maybe: votes.filter(v => v.vote === 0).length,
        no:    votes.filter(v => v.vote === -1).length,
      })

      // 2) Load my existing vote (if any)
      const { data: sess } = await supabase.auth.getSession()
      if (sess.session) {
        const { data: me } = await supabase
          .from('poll_reactions')
          .select('vote')
          .eq('poll_id', pollId)
          .eq('user_id', sess.session.user.id)
          .single()
        setMyVote(me?.vote ?? null)
      }
    })()
  }, [pollId])

  const handleVote = async v => {
    const prev = myVote
    const next = prev === v ? null : v

    // optimistic counts
    setCounts(c => {
      const upd = { ...c }
      // remove old
      if (prev === 1)   upd.yes--  
      else if (prev === 0) upd.maybe--  
      else if (prev === -1) upd.no--  
      // add new
      if (next === 1)   upd.yes++  
      else if (next === 0) upd.maybe++  
      else if (next === -1) upd.no++  
      return upd
    })
    setMyVote(next)

    // now sync with Supabase
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) {
      alert('Пожалуйста, войдите.')
      return
    }
    const uid = sess.session.user.id

    if (next === null) {
      // user un-voted
      supabase
        .from('poll_reactions')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', uid)
        .then(({ error }) => error && console.error(error))
    } else {
      // upsert new/changed vote
      supabase
        .from('poll_reactions')
        .upsert(
          { poll_id: pollId, user_id: uid, vote: next },
          { onConflict: ['poll_id', 'user_id'] }
        )
        .then(({ error }) => error && console.error(error))
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
      <button
        style={{ color: myVote === 1 ? 'green' : undefined }}
        onClick={() => handleVote(1)}
      >
        👍 {counts.yes}
      </button>
      <button
        style={{ color: myVote === 0 ? 'orange' : undefined }}
        onClick={() => handleVote(0)}
      >
        🤔 {counts.maybe}
      </button>
      <button
        style={{ color: myVote === -1 ? 'red' : undefined }}
        onClick={() => handleVote(-1)}
      >
        👎 {counts.no}
      </button>
    </div>
  )
}
