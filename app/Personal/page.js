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
  const [stats, setStats] = useState({ ideasCount: 0, totalLikes: 0, rank: null })
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
        setStats({ ideasCount: 0, totalLikes: 0, rank: null })
        setNotifications([])
        return
      }

      const { data: stud } = await supabase
        .from('students')
        .select('firstname, lastname, student_id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!mounted || !stud) return
      setStudent({ firstname: stud.firstname, lastname: stud.lastname })
      setStudentId(stud.student_id)

      const { data: ideas } = await supabase
        .from('ideas')
        .select('student_id, content, idea_votes(vote)')
      if (!ideas) return

      const likesMap = {}
      ideas.forEach(i => {
        const c = i.idea_votes.filter(v => v.vote === 1).length
        likesMap[i.student_id] = (likesMap[i.student_id] || 0) + c
      })

      const ideasCount = ideas.filter(i => i.student_id === stud.student_id).length
      const totalLikes = likesMap[stud.student_id] || 0

      const sortedIds = Object.entries(likesMap)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => Number(id))
      const rank = sortedIds.indexOf(stud.student_id) + 1

      const notes = ideas
        .filter(i => i.student_id === stud.student_id)
        .filter(i => i.idea_votes.filter(v => v.vote === 1).length >= LIKE_THRESHOLD)
        .map(i => `Ваша идея «${i.content}» набрала ${LIKE_THRESHOLD}+ лайков и отправлена на рассмотрение.`)

      setStats({ ideasCount, totalLikes, rank })
      setNotifications(notes)
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

  if (!sessionChecked) return <div className={styles.loadingContainer}></div>

  if (!session) return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <AuthForm />
      </div>
    </div>
  )

  if (!student) return <div className={styles.loadingContainer}></div>

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
          </div>
          <div className={styles.notificationsWrapper}>
            <NotificationsBell notifications={notifications} />
          </div>
        </div>

        {/* Stats Block */}
        
          <StatsPanel
            ideasCount={stats.ideasCount}
            totalLikes={stats.totalLikes}
            rank={stats.rank}
          />
        

        {/* Top Message Block */}
        {stats.rank === 1 && (
          <div className={styles.topMessageBlock}>
            <div className={styles.topMessageContent}>
              Ваши идеи самые популярные среди студентов! 🎉
            </div>
          </div>
        )}

        {/* Logout Block */}
        <div className={styles.logoutBlock}>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}