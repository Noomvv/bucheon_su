// app/Personal/page.js
'use client'

import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useQueryClient } from '@tanstack/react-query'
import { useSession, useStudentData, useStats, useNotifications } from '../hooks/usePersonalData'
import AuthForm from '../components/AuthForm'
import StatsPanel from '../components/StatsPanel'
import NotificationsBell from '../components/NotificationsBell'
import UserProfileSkeleton from '../components/UserProfileSkeleton'
import StatsPanelSkeleton from '../components/StatsPanelSkeleton'
import VolunteerMessageSkeleton from '../components/VolunteerMessageSkeleton'
import styles from './page.module.css'

export default function PersonalPage() {
  const queryClient = useQueryClient()
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: student, isLoading: studentLoading } = useStudentData(session)
  const { data: stats, isLoading: statsLoading } = useStats(student?.student_id)
  const { data: notifications = [] } = useNotifications(student?.student_id)

  // Подписка на изменения авторизации
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  // Показываем скелет загрузки
  const isLoading = sessionLoading || (session && studentLoading)

  if (sessionLoading) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <UserProfileSkeleton />
          <StatsPanelSkeleton />
          <VolunteerMessageSkeleton />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <AuthForm />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <UserProfileSkeleton />
          <StatsPanelSkeleton />
          <VolunteerMessageSkeleton />
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className={styles.errorContainer}>
        <p>Ошибка загрузки данных студента</p>
      </div>
    )
  }

  // Форматируем дату регистрации
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        {/* Header Block */}
        <div className={styles.headerBlock}>
          <div className={styles.headerContent}>
            <h2 className={styles.greeting}>Добро пожаловать</h2>
            <h1 className={styles.userName}>
              {student.firstname} {student.lastname}
            </h1>
            
            {/* Telegram информация */}
            <div className={styles.contactInfo}>
              {student.telegram_username && (
                <p className={styles.contactItem}>
                  <span className={styles.contactIcon}>📱</span>
                  @{student.telegram_username}
                </p>
              )}
              
              {student.phone_number && (
                <p className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  {student.phone_number}
                </p>
              )}
              
              {student.faculty && (
                <p className={styles.contactItem}>
                  <span className={styles.contactIcon}>🎓</span>
                  {student.faculty}
                  {student.enrollment_year && `, ${student.enrollment_year} год`}
                </p>
              )}
              
              {student.registration_date && (
                <p className={styles.contactItem}>
                  <span className={styles.contactIcon}>📅</span>
                  Зарегистрирован: {formatDate(student.registration_date)}
                </p>
              )}
            </div>
          </div>
          <div className={styles.notificationsWrapper}>
            <NotificationsBell notifications={notifications} />
          </div>
        </div>

        {/* Stats Block */}
        {statsLoading ? (
          <StatsPanelSkeleton />
        ) : (
          <StatsPanel
            ideasCount={stats?.ideasCount || 0}
            totalLikes={stats?.totalLikes || 0}
            volunteerHours={stats?.volunteerHours || 0}
          />
        )}

        {/* Top Message Block */}
        {statsLoading ? (
          <VolunteerMessageSkeleton />
        ) : (
          stats?.volunteerHours > 0 && (
            <div className={styles.topMessageBlock}>
              <div className={styles.topMessageContent}>
                {stats.volunteerHours >= 50 ? '🏆 Вы активный волонтер!' : 
                 stats.volunteerHours >= 20 ? '👍 Спасибо за вашу помощь!' :
                 '🌟 Вы начинающий волонтер!'}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}