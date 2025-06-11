'use client'
import { useState, useEffect } from 'react'
import { supabase }            from '../../lib/supabaseClient'
import AuthForm                from '../components/AuthForm'
import LogoutButton            from '../components/LogoutButton'

export default function PersonalPage() {
  const [session, setSession] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1) Получаем сессию при монтировании
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession)
      setStudent(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // 2) Если есть сессия, подтягиваем имя студента
  useEffect(() => {
    if (!session) return
    supabase
      .from('students')
      .select('firstname')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => setStudent(data))
  }, [session])

  if (loading) return <p>Загрузка…</p>

  // 3) Нет сессии — показываем форму логина/регистрации
  if (!session) {
    return <AuthForm />
  }

  // 4) Есть сессия и студент найден — приветствие
  if (student) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h2>Привет, {student.firstname}!</h2>
        <LogoutButton />
      </div>
    )
  }

  // 5) Есть сессия, но студент ещё не привязан (shouldn't happen) — показываем AuthForm
  return <AuthForm />
}
