// app/components/IdeaForm.js
'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import styles from './IdeaForm.module.css'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

export default function IdeaForm({ onSuccess }) {
  const queryClient = useQueryClient()
  const [studentId, setStudentId] = useState(null)
  const [dbCategories, setDbCategories] = useState([])
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Новое состояние для загрузки авторизации
  const [error, setError] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  // Получаем student_id текущего пользователя
  useEffect(() => {
    const fetchStudentId = async () => {
      setAuthLoading(true)
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData.session?.user
        
        if (user) {
          const { data: studentData } = await supabase
            .from('students')
            .select('student_id')
            .eq('auth_user_id', user.id)
            .single()
            
          setStudentId(studentData?.student_id || null)
        } else {
          setStudentId(null)
        }
      } catch (error) {
        console.error('Error fetching student ID:', error)
        setStudentId(null)
      } finally {
        setAuthLoading(false)
      }
    }

    fetchStudentId()
  }, [])

  // Загружаем уникальные категории из БД
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('ideas')
        .select('category', { distinct: true })
        
      const cats = data?.map(r => r.category).filter(Boolean) || []
      setDbCategories(cats)
    }

    fetchCategories()
  }, [])

  // Объединяем и сортируем категории
  const categories = Array.from(
    new Set([...STATIC_CATEGORIES, ...dbCategories])
  ).sort()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!category || !content.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const { error: submitError } = await supabase
        .from('ideas')
        .insert({ 
          student_id: studentId, 
          category, 
          content 
        })

      if (submitError) throw submitError
      
      setContent('')
      setCategory('')
      setFormVisible(false)
      
      // Инвалидируем кэш идей чтобы обновить список
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['ideaCategories'] })
      
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.buttonContainer}>
          <button className={styles.submitButton} disabled>
            Загрузка...
          </button>
        </div>
      </div>
    )
  }

  // Если пользователь не авторизован
  if (studentId === null) {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.authMessageContainer}>
          <p className={styles.authMessage}>
            Чтобы предложить идею, пожалуйста,{' '}
            <Link href="/Personal" className={styles.link}>
              войдите или зарегистрируйтесь
            </Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.outerContainer}>
      {!formVisible ? (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => setFormVisible(true)}
            className={styles.submitButton}
          >
            Опубликовать идею
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.selectContainer}>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className={styles.select}
                disabled={loading}
              >
                <option value="">Выберите категорию</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Опишите вашу идею максимально подробно..."
              required
              className={styles.textarea}
              disabled={loading}
              rows={6}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <span className={styles.buttonText}>Отправка...</span>
              ) : (
                <span className={styles.buttonText}>Опубликовать идею</span>
              )}
            </button>
            {/* <button
              type="button"
              onClick={() => setFormVisible(false)}
              className={styles.cancelButton}
              disabled={loading}
            >
              Отмена
            </button> */}
          </div>
        </form>
      )}
    </div>
  )
}