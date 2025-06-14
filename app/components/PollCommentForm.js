// app/components/PollCommentForm.js
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import styles from './PollCommentForm.module.css'

export default function PollCommentForm({ pollId, onCommented }) {
  const [text, setText] = useState('')
  const [submitting, setSub] = useState(false)

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
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Написать комментарий..."
          className={styles.input}
        />
        <button 
          type="submit" 
          disabled={submitting || !text.trim()}
          className={styles.submitButton}
        >
          {submitting ? (
            '...'
          ) : (
            <PaperAirplaneIcon className={styles.icon} />
          )}
        </button>
      </div>
    </form>
  )
}