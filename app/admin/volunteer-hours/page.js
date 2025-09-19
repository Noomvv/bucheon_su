// app/admin/volunteer-hours/page.js
'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function AdminVolunteerHours() {
  const [secret, setSecret] = useState('')
  const [studentId, setStudentId] = useState('')
  const [hours, setHours] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSecretSubmit = async (e) => {
    e.preventDefault()
    // Простая проверка секретного слова (в реальном приложении используйте более secure метод)
    if (secret === 'admin123') { // Замените на ваше секретное слово
      setStep(2)
    } else {
      alert('Неверное секретное слово')
    }
  }

  const handleHoursSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/volunteers/add-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: parseInt(studentId),
          hours: parseInt(hours)
        }),
      })

      if (response.ok) {
        alert('Часы успешно добавлены!')
        setStudentId('')
        setHours('')
      } else {
        const error = await response.json()
        alert(error.message || 'Произошла ошибка')
      }
    } catch (error) {
      alert('Произошла ошибка при отправке запроса')
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className={styles.container}>
        <h1>Админ-панель волонтерства</h1>
        <form onSubmit={handleSecretSubmit} className={styles.form}>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Введите секретное слово"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Войти
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Добавить часы волонтерства</h1>
      <form onSubmit={handleHoursSubmit} className={styles.form}>
        <input
          type="number"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID"
          required
          className={styles.input}
        />
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Количество часов"
          required
          min="1"
          className={styles.input}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Добавление...' : 'Добавить часы'}
        </button>
      </form>
    </div>
  )
}