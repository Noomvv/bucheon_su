// app/components/AuthForm.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase }  from '../../lib/supabaseClient'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode]         = useState('login')   // 'login' | 'register'
  const [studentId, setStudentId] = useState('')
  const [login, setLogin]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const switchMode = () => {
    setError(''); setLoading(false)
    setMode(mode === 'login' ? 'register' : 'login')
  }

  const handleLogin = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
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
    // проверка студента
    const { data: stud, error: e1 } = await supabase
      .from('students')
      .select('auth_user_id')
      .eq('student_id', idNum)
      .single()
    if (e1 || !stud) {
      setLoading(false)
      return setError('Студент не найден')
    }
    if (stud.auth_user_id) {
      setLoading(false)
      return setError('Уже зарегистрирован')
    }

    // регистрация
    const { data: sd, error: e2 } = await supabase.auth.signUp({
      email: login,
      password
    })
    if (e2) {
      setLoading(false)
      return setError(e2.message)
    }

    // привязка к students
    const { error: e3 } = await supabase
      .from('students')
      .update({ auth_user_id: sd.user.id, email: login })
      .eq('student_id', idNum)
    if (e3) {
      setLoading(false)
      return setError(e3.message)
    }

    // автологин
    const { error: e4 } = await supabase.auth.signInWithPassword({
      email: login,
      password
    })
    setLoading(false)
    if (e4) {
      return setError(e4.message)
    }

    router.push('/Personal')
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>
        {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
      </h2>

      <form
        onSubmit={mode === 'login' ? handleLogin : handleRegister}
        style={{ display: 'grid', gap: 12 }}
      >
        {mode === 'register' && (
          <label>
            Student ID:<br/>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        )}

        <label>
          Логин:<br/>
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Пароль:<br/>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        {mode === 'register' && (
          <label>
            Подтвердите пароль:<br/>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#3366FF',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          {loading
            ? '…'
            : mode === 'login'
            ? 'Войти'
            : 'Зарегистрироваться'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 12 }}>
        {mode === 'login' ? 'Нет аккаунта?' : 'Есть аккаунт?'}{' '}
        <button
          onClick={switchMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#3366FF',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {mode === 'login' ? 'Регистрация' : 'Вход'}
        </button>
      </p>
    </div>
  )
}
