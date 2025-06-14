// app/components/PollCommentForm.js
'use client'

import { useState }  from 'react'
import { supabase }  from '../../lib/supabaseClient'

export default function PollCommentForm({ pollId, onCommented }) {
  const [text, setText]       = useState('')
  const [submitting, setSub]  = useState(false)

  const submit = async e => {
    e.preventDefault()
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      alert('Пожалуйста, войдите.')
      return
    }
    setSub(true)
    await supabase
      .from('poll_comments')
      .insert({
        poll_id: pollId,
        user_id: session.session.user.id,
        comment: text
      })
    setText('')
    setSub(false)
    onCommented()
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 8 }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ваш комментарий…"
        style={{ width: '80%', marginRight: 8 }}
      />
      <button type="submit" disabled={submitting || !text.trim()}>
        {submitting ? '…' : 'Комментировать'}
      </button>
    </form>
  )
}
