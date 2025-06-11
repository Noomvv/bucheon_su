'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AuthForm from '../components/AuthForm'
import LogoutButton from '../components/LogoutButton'
import styles from './page.module.css'

export default function PersonalPage() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [session, setSession] = useState(null)
  const [student, setStudent] = useState(null)
  const [stats, setStats] = useState({ courses: 0, progress: 0 })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionChecked(true)
      if (data.session) {
        // Загружаем данные студента
        supabase
          .from('students')
          .select('firstname, lastname')
          .eq('auth_user_id', data.session.user.id)
          .single()
          .then(({ data }) => setStudent(data))

        // Загружаем статистику (пример)
        loadUserStats(data.session.user.id)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession)
      setStudent(null)
      setSessionChecked(true)
      if (newSession) {
        supabase
          .from('students')
          .select('firstname, lastname')
          .eq('auth_user_id', newSession.user.id)
          .single()
          .then(({ data }) => setStudent(data))
        
        loadUserStats(newSession.user.id)
      }
    })

    return () => sub?.subscription?.unsubscribe()
  }, [])

  const loadUserStats = async (userId) => {
    // Здесь пример загрузки статистики, замените на реальные запросы
    const fakeStats = {
      courses: 3,
      progress: 75
    }
    setStats(fakeStats)
  }

  if (!sessionChecked) {
    return <div className={styles.container}><AuthForm /></div>
  }

  if (!session) {
    return <AuthForm />
  }

  return (
  <div className={styles.container}>
    {student ? (
      <>
        <div className={styles.header}>
          <h2 className={styles.greeting}>Добро пожаловать</h2>
          <h1 className={styles.userName}>
            {student.firstname} {student.lastname}
          </h1>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.courses}</div>
            <div className={styles.statLabel}>Активных курсов</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.progress}%</div>
            <div className={styles.statLabel}>Общий прогресс</div>
          </div>
        </div>

        <div className={styles.logoutWrapper}>
          <LogoutButton />
        </div>
      </>
    ) : (
      <AuthForm />
    )}
  </div>
)
}