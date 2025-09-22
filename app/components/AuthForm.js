// components/AuthForm.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './AuthForm.module.css'

export default function AuthForm({ onSuccess }) {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [studentId, setStudentId] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const switchMode = (newMode) => {
    setError('')
    setLoading(false)
    setEmailSent(false)
    setMode(newMode)
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
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/Personal')
      }
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

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/Personal')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!login.trim()) {
      setError('Введите email')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(login, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setEmailSent(true)
    }
  }

  if (mode === 'forgot') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Восстановление пароля</h2>

        {emailSent ? (
          <div className={styles.successMessage}>
            <p>Письмо с инструкциями отправлено на {login}</p>
            <p>Проверьте вашу почту и следуйте инструкциям</p>
            <button
              onClick={() => switchMode('login')}
              className={styles.switchButton}
            >
              Вернуться к входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className={styles.form}>
            <label className={styles.label}>
              Ваш email:
              <input
                type="email"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
                className={styles.input}
                placeholder="Введите email для восстановления"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Отправка...' : 'Восстановить пароль'}
            </button>

            <p className={styles.switchText}>
              Вспомнили пароль?
              <button
                onClick={() => switchMode('login')}
                className={styles.switchButton}
              >
                Войти
              </button>
            </p>
          </form>
        )}

        <div className={styles.promoWrapper}>
          <img
            src="/images/promo.png"
            alt="Человек думает"
            className={styles.promoImageOverlap}
          />
          <div className={styles.promoBlock}>
            <div className={styles.promoText}>Все пароли шифруются с использованием bcrypt-хеширования.</div>
          </div>
        </div>
      </div>
    )
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
                placeholder="Введите ваш Student ID"
              />
            </label>
          </>
        )}

        <label className={styles.label}>
          Ваш email:
          <input
            type="email"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            className={styles.input}
            placeholder="example@email.com"
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
            placeholder="Не менее 8 символов"
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
              placeholder="Повторите пароль"
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
        {mode === 'login' ? (
          <>
            Нет аккаунта?
            <button
              onClick={() => switchMode('register')}
              className={styles.switchButton}
            >
              Регистрация
            </button>
          </>
        ) : (
          <>
            Есть аккаунт?
            <button
              onClick={() => switchMode('login')}
              className={styles.switchButton}
            >
              Вход
            </button>
          </>
        )}
      </p>

      {mode === 'login' && (
        <p className={styles.switchText}>
          Забыли пароль?
          <button
            onClick={() => switchMode('forgot')}
            className={styles.switchButton}
          >
            Восстановить
          </button>
        </p>
      )}

      <div className={styles.promoWrapper}>
        <img
          src="/images/promo2.png"
          alt="Человек думает"
          className={styles.promoImageOverlap}
        />
        <div className={styles.promoBlock}>
          <div className={styles.promoText}>Все пароли шифруются с использованием bcrypt-хеширования.</div>
        </div>
      </div>
    </div>
  )
}