'use client'

import { useState, useEffect } from 'react'
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
  const [studentId, setStudentId] = useState(null)
  const [dbCategories, setDbCategories] = useState([])
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Получаем student_id текущего пользователя
  useEffect(() => {
    const fetchStudentId = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      
      if (user) {
        const { data: studentData } = await supabase
          .from('students')
          .select('student_id')
          .eq('auth_user_id', user.id)
          .single()
          
        setStudentId(studentData?.student_id || null)
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
        
      const cats = data.map(r => r.category).filter(Boolean)
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
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.inputGroup}>
          {/* <label htmlFor="category" className={styles.label}>
            Категория:
          </label> */}
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
          {/* <label htmlFor="content" className={styles.label}>
            Текст идеи:
          </label> */}
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
        </div>
      </form>
    </div>
  )
}