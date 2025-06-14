'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './AuthForm.module.css'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [studentId, setStudentId] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = () => {
    setError('')
    setLoading(false)
    setMode(mode === 'login' ? 'register' : 'login')
  }

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: login,
      password
    })
    
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/Personal')
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setError('')

    const idNum = parseInt(studentId.trim(), 10)
    if (isNaN(idNum)) {
      return setError('Неверный Student ID')
    }
    if (password.length < 8 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      return setError('Пароль ≥8 символов, буквы и цифры')
    }
    if (password !== confirm) {
      return setError('Пароли не совпадают')
    }

    setLoading(true)
    
    try {
      // Проверка студента
      const { data: stud, error: e1 } = await supabase
        .from('students')
        .select('auth_user_id')
        .eq('student_id', idNum)
        .single()

      if (e1 || !stud) {
        throw new Error('Студент не найден')
      }
      if (stud.auth_user_id) {
        throw new Error('Уже зарегистрирован')
      }

      // Регистрация
      const { data: sd, error: e2 } = await supabase.auth.signUp({
        email: login,
        password
      })

      if (e2) throw e2

      // Привязка к students
      const { error: e3 } = await supabase
        .from('students')
        .update({ auth_user_id: sd.user.id, email: login })
        .eq('student_id', idNum)

      if (e3) throw e3

      // Автологин
      const { error: e4 } = await supabase.auth.signInWithPassword({
        email: login,
        password
      })

      if (e4) throw e4

      router.push('/Personal')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
      </h2>

      <form
        onSubmit={mode === 'login' ? handleLogin : handleRegister}
        className={styles.form}
      >
        {mode === 'register' && (
          <>
            <label className={styles.label}>
              Student ID:
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                required
                className={styles.input}
              />
            </label>
          </>
        )}

        <label className={styles.label}>
          Ваш email:
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Пароль:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        {mode === 'register' && (
          <label className={styles.label}>
            Подтвердите пароль:
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className={styles.input}
            />
          </label>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className={styles.switchText}>
        {mode === 'login' ? 'Нет аккаунта?' : 'Есть аккаунт?'}
        <button
          onClick={switchMode}
          className={styles.switchButton}
        >
          {mode === 'login' ? 'Регистрация' : 'Вход'}
        </button>
      </p>
    </div>
  )
}