// app/Personal/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AuthForm from '../components/AuthForm'
import LogoutButton from '../components/LogoutButton'
import StatsPanel from '../components/StatsPanel'
import NotificationsBell from '../components/NotificationsBell'
import styles from './page.module.css'

const LIKE_THRESHOLD = 100

export default function PersonalPage() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [session, setSession] = useState(null)
  const [student, setStudent] = useState(null)
  const [studentId, setStudentId] = useState(null)
  const [stats, setStats] = useState({ 
    ideasCount: 0, 
    totalLikes: 0, 
    volunteerHours: 0
  })
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let mounted = true

    const handleSession = async (session) => {
      if (!mounted) return
      setSession(session)
      setSessionChecked(true)

      if (!session) {
        setStudent(null)
        setStudentId(null)
        setStats({ ideasCount: 0, totalLikes: 0, volunteerHours: 0 })
        setNotifications([])
        return
      }

      // Получаем полные данные студента включая Telegram
      const { data: stud } = await supabase
        .from('students')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!mounted || !stud) return
      
      setStudent({ 
        firstname: stud.firstname, 
        lastname: stud.lastname,
        telegram_username: stud.telegram_username,
        phone_number: stud.phone_number,
        registration_date: stud.registration_date,
        faculty: stud.faculty,
        enrollment_year: stud.enrollment_year
      })
      setStudentId(stud.student_id)

      // Загрузка статистики идей
      const { data: ideas } = await supabase
        .from('ideas')
        .select('student_id, content, idea_votes(vote)')
      
      if (ideas) {
        const likesMap = {}
        ideas.forEach(i => {
          const c = i.idea_votes.filter(v => v.vote === 1).length
          likesMap[i.student_id] = (likesMap[i.student_id] || 0) + c
        })

        const ideasCount = ideas.filter(i => i.student_id === stud.student_id).length
        const totalLikes = likesMap[stud.student_id] || 0

        // Загрузка часов волонтерства
        const { data: volunteer } = await supabase
          .from('volunteers')
          .select('total_hours')
          .eq('student_id', stud.student_id)
          .single()

        const volunteerHours = volunteer?.total_hours || 0

        const notes = ideas
          .filter(i => i.student_id === stud.student_id)
          .filter(i => i.idea_votes.filter(v => v.vote === 1).length >= LIKE_THRESHOLD)
          .map(i => `Ваша идея «${i.content}» набрала ${LIKE_THRESHOLD}+ лайков и отправлена на рассмотрение.`)

        setStats({ ideasCount, totalLikes, volunteerHours })
        setNotifications(notes)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleSession(session)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (!sessionChecked) return <div className={styles.loadingContainer}>Загрузка...</div>

  if (!session) return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <AuthForm />
      </div>
    </div>
  )

  if (!student) return <div className={styles.loadingContainer}>Загрузка данных студента...</div>

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
        <StatsPanel
          ideasCount={stats.ideasCount}
          totalLikes={stats.totalLikes}
          volunteerHours={stats.volunteerHours}
        />

        {/* Top Message Block */}
        {stats.volunteerHours > 0 && (
          <div className={styles.topMessageBlock}>
            <div className={styles.topMessageContent}>
              {stats.volunteerHours >= 50 ? '🏆 Вы активный волонтер!' : 
               stats.volunteerHours >= 20 ? '👍 Спасибо за вашу помощь!' :
               '🌟 Вы начинающий волонтер!'}
            </div>
          </div>
        )}

        {/* Logout Block */}
        {/* <div className={styles.logoutBlock}>
          <LogoutButton />
        </div> */}
      </div>
    </div>
  )
}