'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import Link                     from 'next/link'

export default function PollCard({ poll }) {
  const [stats, setStats]       = useState({ yes: 0, maybe: 0, no: 0 })
  const [myVote, setMyVote]     = useState(0)
  const [loadingVote, setLoadingVote] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    // 1) Load all votes for this poll
    const { data: votes = [] } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', poll.id)

    // 2) Tally
    setStats({
      yes:   votes.filter(v => v.vote === 1).length,
      maybe: votes.filter(v => v.vote === 0).length,
      no:    votes.filter(v => v.vote === -1).length,
    })

    // 3) Load your vote
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

    // check existing
    const { data: existing } = await supabase
      .from('poll_reactions')
      .select('vote')
      .eq('poll_id', poll.id)
      .eq('user_id', uid)
      .single()

    if (existing) {
      if (existing.vote === value) {
        // remove vote
        await supabase
          .from('poll_reactions')
          .delete()
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      } else {
        // change vote
        await supabase
          .from('poll_reactions')
          .update({ vote: value })
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      }
    } else {
      // insert new
      await supabase
        .from('poll_reactions')
        .insert({ poll_id: poll.id, user_id: uid, vote: value })
    }

    await loadStats()
    setLoadingVote(false)
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 4,
      padding: 12,
      marginBottom: 12
    }}>
      <h3>{poll.question}</h3>

      <div style={{ display: 'flex', gap: 12, margin: '8px 0' }}>
        <button
          disabled={loadingVote}
          style={{ color: myVote === 1 ? 'green' : undefined }}
          onClick={() => handleReact(1)}
        >
          👍 {stats.yes}
        </button>
        <button
          disabled={loadingVote}
          style={{ color: myVote === 0 ? 'orange' : undefined }}
          onClick={() => handleReact(0)}
        >
          🤔 {stats.maybe}
        </button>
        <button
          disabled={loadingVote}
          style={{ color: myVote === -1 ? 'red' : undefined }}
          onClick={() => handleReact(-1)}
        >
          👎 {stats.no}
        </button>
      </div>

      <Link href={`/Polls/${poll.id}`}>
        <button style={{ marginTop: 8 }}>Комментарии »</button>
      </Link>
    </div>
  )
}
