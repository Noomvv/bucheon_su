'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PollCommentForm({ pollId, onCommented }) {
  const [text, setText] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!text.trim()) return

    const { data: sess } = await supabase.auth.getSession()
    if (!sess.session) {
      alert('Войдите, чтобы комментировать.')
      return
    }

    const { error } = await supabase
      .from('poll_comments')
      .insert({
        poll_id: pollId,
        user_id: sess.session.user.id,
        comment: text.trim()
      })

    if (error) {
      console.error(error)
      alert('Не удалось отправить комментарий.')
    } else {
      setText('')
      onCommented()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ваш комментарий…"
        rows={3}
        style={{ width: '100%', padding: 8 }}
      />
      <button type="submit" style={{ marginTop: 8 }}>
        Отправить
      </button>
    </form>
  )
}
