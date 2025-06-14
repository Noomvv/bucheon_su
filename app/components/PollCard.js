'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import Link                     from 'next/link'

export default function PollCard({ poll }) {
  const [stats, setStats]   = useState({ yes: 0, maybe: 0, no: 0 })
  const [reaction, setReaction] = useState(0)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    // все голоса для этого опроса
    const { data: votes = [] } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', poll.id)

    setStats({
      yes:   votes.filter(v => v.vote === 1).length,
      maybe: votes.filter(v => v.vote === 0).length,
      no:    votes.filter(v => v.vote === -1).length,
    })

    // моя реакция
    const { data: sess } = await supabase.auth.getSession()
    if (sess.session) {
      const { data: me } = await supabase
        .from('poll_reactions')
        .select('vote')
        .eq('poll_id', poll.id)
        .eq('user_id', sess.session.user.id)
        .single()
      setReaction(me?.vote || 0)
    }
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 4,
      padding: 12,
      marginBottom: 12
    }}>
      <h3>{poll.question}</h3>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <span>👍 {stats.yes}</span>
        <span>🤔 {stats.maybe}</span>
        <span>👎 {stats.no}</span>
      </div>
      <Link href={`/Polls/${poll.id}`}>
        <button style={{ marginTop: 12 }}>Комментарии &gt;&gt;</button>
      </Link>
    </div>
  )
}
