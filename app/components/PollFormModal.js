// app/components/PollFormModal.js
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { XMarkIcon } from '@heroicons/react/24/outline'
import styles from './PollFormModal.module.css'

export default function PollFormModal({ onClose }) {
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!question.trim()) {
      setError('Вопрос не может быть пустым')
      return
    }
    
    setSubmitting(true)
    const { error: supabaseError } = await supabase
      .from('polls')
      .insert({ question })
    
    if (supabaseError) {
      setError(supabaseError.message)
    } else {
      onClose()
    }
    setSubmitting(false)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Новый опрос</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            rows={4}
            className={styles.textarea}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Напишите текст опроса..."
          />

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
              disabled={submitting}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}