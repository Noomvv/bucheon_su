'use client'

import { useState, useEffect } from 'react'
import { supabase }            from '../../lib/supabaseClient'
import AuthForm                from '../components/AuthForm'
import LogoutButton            from '../components/LogoutButton'
import StatsPanel              from '../components/StatsPanel'
import NotificationsBell       from '../components/NotificationsBell'
import styles                  from './page.module.css'

const LIKE_THRESHOLD = 100

export default function PersonalPage() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [session, setSession]               = useState(null)
  const [student, setStudent]               = useState(null)
  const [studentId, setStudentId]           = useState(null)
  const [stats, setStats]                   = useState({ ideasCount: 0, totalLikes: 0, rank: null })
  const [notifications, setNotifications]   = useState([])

  useEffect(() => {
    let mounted = true

    // Общая функция для обработки нового состояния сессии
    const handleSession = async (session) => {
      if (!mounted) return
      setSession(session)
      setSessionChecked(true)

      if (!session) {
        // сбросим данные при выходе
        setStudent(null)
        setStudentId(null)
        setStats({ ideasCount: 0, totalLikes: 0, rank: null })
        setNotifications([])
        return
      }

      // при входе — тянем студента
      const { data: stud } = await supabase
        .from('students')
        .select('firstname, lastname, student_id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!mounted || !stud) return
      setStudent({ firstname: stud.firstname, lastname: stud.lastname })
      setStudentId(stud.student_id)

      // и его статистику + уведомления
      const { data: ideas } = await supabase
        .from('ideas')
        .select('student_id, content, idea_votes(vote)')
      if (!ideas) return

      // подсчёт лайков по каждому student_id
      const likesMap = {}
      ideas.forEach(i => {
        const c = i.idea_votes.filter(v => v.vote === 1).length
        likesMap[i.student_id] = (likesMap[i.student_id] || 0) + c
      })

      // метрики текущего студента
      const ideasCount = ideas.filter(i => i.student_id === stud.student_id).length
      const totalLikes = likesMap[stud.student_id] || 0

      // рейтинг
      const sortedIds = Object.entries(likesMap)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => Number(id))
      const rank = sortedIds.indexOf(stud.student_id) + 1

      // уведомления
      const notes = ideas
        .filter(i => i.student_id === stud.student_id)
        .filter(i => i.idea_votes.filter(v => v.vote === 1).length >= LIKE_THRESHOLD)
        .map(i => `Ваша идея «${i.content}» набрала ${LIKE_THRESHOLD}+ лайков и отправлена на рассмотрение.`)

      setStats({ ideasCount, totalLikes, rank })
      setNotifications(notes)
    }

    // 1) Разовая проверка при монтировании
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    // 2) Подписка на будущие изменения
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

  // 1) Ждём, пока не вызовется getSession()
  if (!sessionChecked) return null

  // 2) Если нет сессии — форма
  if (!session) return <AuthForm />

  // 3) Если сессия есть, но студент ещё не загружен — показываем ничего/loader
  if (!student) return null

  // 4) Всё готово — рендерим кабинет
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.greeting}>Добро пожаловать</h2>
          <h1 className={styles.userName}>
            {student.firstname} {student.lastname}
          </h1>
        </div>
        <NotificationsBell notifications={notifications} />
      </div>

      <StatsPanel
        ideasCount={stats.ideasCount}
        totalLikes={stats.totalLikes}
        rank={stats.rank}
      />

      {stats.rank === 1 && (
        <div className={styles.topMessage}>
          Ваши идеи самые популярные среди студентов! 🎉
        </div>
      )}

      <div className={styles.logoutWrapper}>
        <LogoutButton />
      </div>
    </div>
  )
}
