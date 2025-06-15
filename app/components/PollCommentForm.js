'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import styles from './PollCommentForm.module.css'

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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ваш комментарий…"
          rows={1}
          className={styles.commentInput}
        />
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={!text.trim()}
          aria-label="Отправить комментарий"
        >
          <PaperAirplaneIcon className={styles.sendIcon} />
        </button>
      </div>
    </form>
  )
}