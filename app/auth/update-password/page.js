// app/auth/update-password/page.js
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import styles from './page.module.css'

// Компонент-обертка с Suspense
function UpdatePasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Проверяем параметры URL на клиентской стороне
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const tokenType = urlParams.get('token_type')
    
    if (accessToken && tokenType) {
      console.log('Password reset token detected')
    }
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      return setError('Пароль ≥8 символов, буквы и цифры')
    }
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают')
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSuccess('Пароль успешно обновлен!')
      setTimeout(() => {
        router.push('/Personal')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении пароля')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Обновление пароля</h2>
        
        {success ? (
          <div className={styles.successMessage}>
            <p>{success}</p>
            <p>Перенаправление на страницу профиля...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className={styles.form}>
            <label className={styles.label}>
              Новый пароль:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Не менее 8 символов"
              />
            </label>

            <label className={styles.label}>
              Подтвердите пароль:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Повторите пароль"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Обновление...' : 'Обновить пароль'}
            </button>

            <p className={styles.helpText}>
              После обновления пароля вы будете автоматически перенаправлены на страницу профиля.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

// Главный компонент с Suspense
export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Загрузка...</h2>
        </div>
      </div>
    }>
      <UpdatePasswordContent />
    </Suspense>
  )
}