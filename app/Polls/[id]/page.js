'use client'

import { useState, useEffect } from 'react'
import { useParams }           from 'next/navigation'
import { supabase }            from '../../../lib/supabaseClient'
import PollReactions           from '../../components/PollReactions'
import PollCommentList         from '../../components/PollCommentList'
import PollCommentForm         from '../../components/PollCommentForm'

export default function PollDetailPage() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [commentVersion, setCommentVersion] = useState(0)

  useEffect(() => {
    supabase
      .from('polls')
      .select('question, created_at')
      .eq('id', +id)
      .single()
      .then(({ data, error }) => {
        if (!error) setPoll(data)
      })
  }, [id])

  if (!poll) return <p>Загрузка…</p>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>{poll.question}</h1>
      <small>
        Создано: {new Date(poll.created_at).toLocaleString()}
      </small>

      <PollReactions pollId={+id} />

      {/* Remounts to refetch when commentVersion changes */}
      <PollCommentList key={commentVersion} pollId={+id} />

      <PollCommentForm
        pollId={+id}
        onCommented={() => setCommentVersion(v => v + 1)}
      />
    </div>
  )
}
