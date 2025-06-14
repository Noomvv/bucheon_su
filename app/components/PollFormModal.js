// app/components/PollFormModal.js
'use client'

import { useState }          from 'react'
import { supabase }          from '../../lib/supabaseClient'

export default function PollFormModal({ onClose }) {
  const [question, setQuestion] = useState('')
  const [error, setError]       = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!question.trim()) {
      setError('Вопрос не может быть пустым')
      return
    }
    const { error } = await supabase
      .from('polls')
      .insert({ question })
    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: 20, borderRadius: 4, width: 400
      }}>
        <h2>Новый опрос</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <textarea
          rows={3}
          style={{ width: '100%' }}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Напишите текст опроса…"
        />
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button type="button" onClick={onClose} style={{ marginRight: 8 }}>
            Отмена
          </button>
          <button type="submit">Создать</button>
        </div>
      </form>
    </div>
  )
}
