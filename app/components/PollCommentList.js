'use client'

import { useState, useEffect } from 'react'
import { supabase }            from '../../lib/supabaseClient'
import styles                  from './PollCommentList.module.css'

export default function PollCommentList({ pollId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true) // Добавлено состояние загрузки

  useEffect(() => {
    (async () => {
      setLoading(true) // Устанавливаем состояние загрузки
      // 1) Получаем сырые комментарии, сортируя по created_at DESC
      const { data: comms = [], error: commError } = await supabase
        .from('poll_comments')
        .select('id, comment, created_at, user_id')
        .eq('poll_id', pollId)
        .order('created_at', { ascending: false })   // <- здесь DESC

      if (commError) {
        console.error('Ошибка при загрузке комментариев', commError)
        setLoading(false)
        return
      }

      // 2) Узнаём уникальные user_id и подтягиваем студентов
      const uids = [...new Set(comms.map(c => c.user_id))]
      let students = []
      if (uids.length) {
        const { data: st = [], error: stuError } = await supabase
          .from('students')
          .select('auth_user_id, firstname, lastname, faculty')
          .in('auth_user_id', uids)
        if (stuError) console.error('Ошибка при загрузке студентов', stuError)
        else         students = st
      }

      // 3) Мержим
      const merged = comms.map(c => {
        const s = students.find(s => s.auth_user_id === c.user_id) || {}
        return {
          ...c,
          firstname: s.firstname,
          lastname:  s.lastname,
          faculty:   s.faculty,
        }
      })

      setComments(merged)
      setLoading(false) // Завершаем состояние загрузки
    })()
  }, [pollId])

  if (loading) {
    return (
      <div className={styles.commentsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.skeletonComment}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonBody}></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.commentsContainer}>
      {comments.map(c => (
        <div key={c.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <span className={styles.userName}>
              {c.firstname || '—'} {c.lastname || ''}
            </span>
            {/* <span className={styles.metaInfo}>
              <span className={styles.faculty}>{c.faculty || '—'}</span>
              <span className={styles.timestamp}>
                {new Date(c.created_at).toLocaleString()}
              </span>
            </span> */}
          </div>
          <p className={styles.commentBody}>{c.comment}</p>
        </div>
      ))}
    </div>
  )
}
