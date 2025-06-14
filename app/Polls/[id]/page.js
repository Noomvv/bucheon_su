'use client'

import { useState, useEffect } from 'react'
import { useParams }           from 'next/navigation'
import { supabase }            from '../../../lib/supabaseClient'
import PollCommentList         from '../../components/PollCommentList'
import PollCommentForm         from '../../components/PollCommentForm'

export default function PollDetailPage() {
  // <-- useParams instead of destructuring params prop
  const { id } = useParams()

  const [poll, setPoll]           = useState(null)
  const [stats, setStats]         = useState({ yes:0, maybe:0, no:0 })
  const [reaction, setReaction]   = useState(0)
  const [comments, setComments]   = useState([])

  useEffect(() => {
    loadAll()
  }, [id])

  async function loadAll() {
    // 1) Load poll
    const { data: p } = await supabase
      .from('polls')
      .select('question, created_at')
      .eq('id', +id)
      .single()
    setPoll(p)

    // 2) Load reactions & stats
    const { data: votes = [] } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', +id)

    setStats({
      yes:   votes.filter(v => v.vote === 1).length,
      maybe: votes.filter(v => v.vote === 0).length,
      no:    votes.filter(v => v.vote === -1).length,
    })

    // 3) Load my reaction
    const { data: sess } = await supabase.auth.getSession()
    if (sess.session) {
      const { data: me } = await supabase
        .from('poll_reactions')
        .select('vote')
        .eq('poll_id', +id)
        .eq('user_id', sess.session.user.id)
        .single()
      setReaction(me?.vote || 0)
    }

    // 4) Load comments (id, comment, created_at, user_id)
    const { data: comms = [] } = await supabase
      .from('poll_comments')
      .select('id, comment, created_at, user_id')
      .eq('poll_id', +id)
      .order('created_at', { ascending: true })

    // 5) Batch-fetch student info
    const uids = Array.from(new Set(comms.map(c => c.user_id)))
    let students = []
    if (uids.length) {
      const { data: st } = await supabase
        .from('students')
        .select('auth_user_id, firstname, lastname, faculty')
        .in('auth_user_id', uids)
      students = st || []
    }

    // 6) Merge
    const merged = comms.map(c => {
      const s = students.find(s => s.auth_user_id === c.user_id) || {}
      return {
        ...c,
        firstname: s.firstname,
        lastname:  s.lastname,
        faculty:   s.faculty,
      }
    })

    setComments(merged)
  }

  async function handleReact(v) {
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) return alert('Пожалуйста, войдите.')
    const uid = sess.session.user.id

    const { data: existing } = await supabase
      .from('poll_reactions')
      .select('vote')
      .eq('poll_id', +id)
      .eq('user_id', uid)
      .single()

    if (existing) {
      if (existing.vote === v) {
        await supabase
          .from('poll_reactions')
          .delete()
          .eq('poll_id', +id)
          .eq('user_id', uid)
      } else {
        await supabase
          .from('poll_reactions')
          .update({ vote: v })
          .eq('poll_id', +id)
          .eq('user_id', uid)
      }
    } else {
      await supabase
        .from('poll_reactions')
        .insert({ poll_id: +id, user_id: uid, vote: v })
    }

    loadAll()
  }

  if (!poll) return <p>Загрузка…</p>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>{poll.question}</h1>
      <p><em>Создано:</em> {new Date(poll.created_at).toLocaleString()}</p>

      <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
        <button
          style={{ color: reaction === 1 ? 'green' : undefined }}
          onClick={() => handleReact(1)}
        >
          👍 {stats.yes}
        </button>
        <button
          style={{ color: reaction === 0 ? 'orange' : undefined }}
          onClick={() => handleReact(0)}
        >
          🤔 {stats.maybe}
        </button>
        <button
          style={{ color: reaction === -1 ? 'red' : undefined }}
          onClick={() => handleReact(-1)}
        >
          👎 {stats.no}
        </button>
      </div>

      <PollCommentList comments={comments} />
      <PollCommentForm pollId={+id} onCommented={loadAll} />
    </div>
  )
}
