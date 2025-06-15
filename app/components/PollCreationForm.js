'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PollCreationForm({ onCreated }) {
  const [question, setQuestion] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const text = question.trim()
    if (!text) return

    const { error } = await supabase
      .from('polls')
      .insert({ question: text })

    if (error) {
      console.error('Ошибка создания опроса:', error)
      alert('Не удалось создать опрос.')
    } else {
      setQuestion('')
      onCreated()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <input
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Текст нового опроса"
        style={{ width: '100%', padding: '8px', fontSize: '1em' }}
      />
      <button type="submit" style={{ marginTop: 8 }}>
        Сохранить опрос
      </button>
    </form>
  )
}
