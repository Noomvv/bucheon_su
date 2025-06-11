// app/Personal/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase }            from '../../lib/supabaseClient'
import AuthForm                from '../components/AuthForm'
import LogoutButton            from '../components/LogoutButton'

export default function PersonalPage() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [session, setSession]               = useState(null)
  const [student, setStudent]               = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionChecked(true)
      if (data.session) {
        supabase
          .from('students')
          .select('firstname')
          .eq('auth_user_id', data.session.user.id)
          .single()
          .then(({ data }) => setStudent(data))
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession)
      setStudent(null)
      setSessionChecked(true)
      if (newSession) {
        supabase
          .from('students')
          .select('firstname')
          .eq('auth_user_id', newSession.user.id)
          .single()
          .then(({ data }) => setStudent(data))
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!sessionChecked) {
    // Пока не проверили сессию — показываем форму (или можете показать loader)
    return <AuthForm />
  }

  // Если нет сессии — форма
  if (!session) {
    return <AuthForm />
  }

  // Если есть сессия и имя подтянулось — приветствие
  if (student?.firstname) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h2>Привет, {student.firstname}!</h2>
        <LogoutButton />
      </div>
    )
  }

  // На всякий случай — показываем форму
  return <AuthForm />
}
