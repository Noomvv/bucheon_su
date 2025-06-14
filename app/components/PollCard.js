// app/components/PollCard.js
'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import PollCommentList         from './PollCommentList'
import PollCommentForm         from './PollCommentForm'

export default function PollCard({ poll }) {
  const [reaction, setReaction] = useState(0)
  const [stats, setStats]       = useState({ yes: 0, maybe: 0, no: 0 })
  const [comments, setComments] = useState([])

  useEffect(() => { loadData() }, [])

  async function loadData() {
    // fetch all reactions
    const { data: votes } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', poll.id)

    const yes   = votes.filter(v => v.vote === 1).length
    const maybe = votes.filter(v => v.vote === 0).length
    const no    = votes.filter(v => v.vote === -1).length
    setStats({ yes, maybe, no })

    // fetch my reaction
    const { data: session } = await supabase.auth.getSession()
    if (session.session) {
      const { data: me } = await supabase
        .from('poll_reactions')
        .select('vote')
        .eq('poll_id', poll.id)
        .eq('user_id', session.session.user.id)
        .single()
      setReaction(me?.vote || 0)
    }

    // fetch comments
    const { data: comms } = await supabase
      .from('poll_comments')
      .select(`id, comment, created_at,
               students!inner(firstname,lastname)`)
      .eq('poll_id', poll.id)
      .order('created_at', { ascending: true })
    setComments(comms || [])
  }

  const react = async v => {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      alert('Пожалуйста, войдите.')
      return
    }
    const uid = session.session.user.id

    // upsert reaction
    const { data: existing } = await supabase
      .from('poll_reactions')
      .select('vote')
      .eq('poll_id', poll.id)
      .eq('user_id', uid)
      .single()

    if (existing) {
      if (existing.vote === v) {
        await supabase
          .from('poll_reactions')
          .delete()
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      } else {
        await supabase
          .from('poll_reactions')
          .update({ vote: v })
          .eq('poll_id', poll.id)
          .eq('user_id', uid)
      }
    } else {
      await supabase
        .from('poll_reactions')
        .insert({ poll_id: poll.id, user_id: uid, vote: v })
    }
    loadData()
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 4,
      padding: 12,
      marginBottom: 12
    }}>
      <h3>{poll.question}</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <button
          style={{ color: reaction === 1 ? 'green' : undefined }}
          onClick={() => react(1)}
        >
          👍 {stats.yes}
        </button>
        <button
          style={{ color: reaction === 0 ? 'orange' : undefined }}
          onClick={() => react(0)}
        >
          🤔 {stats.maybe}
        </button>
        <button
          style={{ color: reaction === -1 ? 'red' : undefined }}
          onClick={() => react(-1)}
        >
          👎 {stats.no}
        </button>
      </div>
      <PollCommentList comments={comments} />
      <PollCommentForm pollId={poll.id} onCommented={loadData} />
    </div>
  )
}
