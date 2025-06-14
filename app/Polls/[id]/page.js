'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import PollCommentList from '../../components/PollCommentList'
import PollCommentForm from '../../components/PollCommentForm'

export default function PollDetailPage({ params }) {
  const [poll, setPoll] = useState(null)
  const [stats, setStats] = useState({ yes: 0, maybe: 0, no: 0 })
  const [reaction, setReaction] = useState(0)
  const [comments, setComments] = useState([])
  const [id, setId] = useState(null)

  useEffect(() => {
    async function unwrapParams() {
      const { id } = await params // Разворачиваем params
      setId(id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (id) {
      loadAll()
    }
  }, [id])

  async function loadAll() {
    // Получаем сам опрос
    const { data: p } = await supabase
      .from('polls')
      .select('question, created_at')
      .eq('id', +id)
      .single()
    setPoll(p)

    // Итоги реакций
    const { data: votes = [] } = await supabase
      .from('poll_reactions')
      .select('vote, user_id')
      .eq('poll_id', +id)

    setStats({
      yes: votes.filter(v => v.vote === 1).length,
      maybe: votes.filter(v => v.vote === 0).length,
      no: votes.filter(v => v.vote === -1).length,
    })

    // Моя реакция
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

    // Комментарии
    const { data: comms = [] } = await supabase
      .from('poll_comments')
      .select('id, comment, created_at, students(firstname, lastname)')
      .eq('poll_id', +id)
      .order('created_at', { ascending: true })
    setComments(comms)
  }

  async function handleReact(v) {
    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) {
      alert('Пожалуйста, войдите.')
      return
    }
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
