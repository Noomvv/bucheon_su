'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import Link                     from 'next/link'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

export default function IdeaForm({ onSuccess }) {
  const [studentId, setStudentId]   = useState(null)
  const [dbCategories, setDbCategories] = useState([])
  const [category, setCategory]     = useState('')
  const [content, setContent]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  // 1) Узнаём student_id текущего пользователя
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (user) {
        supabase
          .from('students')
          .select('student_id')
          .eq('auth_user_id', user.id)
          .single()
          .then(({ data }) => setStudentId(data?.student_id || null))
      }
    })
  }, [])

  // 2) Подтягиваем уникальные категории из БД
  useEffect(() => {
    supabase
      .from('ideas')
      .select('category', { distinct: true })
      .then(({ data }) => {
        const cats = data.map(r => r.category).filter(Boolean)
        setDbCategories(cats)
      })
  }, [])

  // Объединяем статические и из БД, убираем дубли и сортируем
  const categories = Array.from(
    new Set([...STATIC_CATEGORIES, ...dbCategories])
  )

  const handleSubmit = async e => {
    e.preventDefault()
    if (!category || !content.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('ideas')
      .insert({ student_id: studentId, category, content })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setContent('')
      setCategory('')
      onSuccess()
    }
  }

  // Если не залогинен — предлагаем войти
  if (studentId === null) {
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: 4,
        marginBottom: 24,
        background: '#f9f9f9'
      }}>
        <p>
          Чтобы предложить идею, пожалуйста,{' '}
          <Link href="/Personal">
             
              войдите или зарегистрируйтесь
            
          </Link>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label htmlFor="category" style={{ display: 'block', marginBottom: 8 }}>
        Категория:
      </label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
        style={{
          width: '100%',
          padding: 8,
          marginBottom: 16,
          borderRadius: 4,
          border: '1px solid #ccc'
        }}
      >
        <option value="">— выберите —</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label htmlFor="content" style={{ display: 'block', marginBottom: 8 }}>
        Текст идеи:
      </label>
      <textarea
        id="content"
        name="content"
        rows={4}
        placeholder="Опишите вашу идею…"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        style={{
          width: '100%',
          padding: 8,
          marginBottom: 16,
          borderRadius: 4,
          border: '1px solid #ccc'
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        {loading ? 'Сохраняем…' : 'Предложить идею'}
      </button>
    </form>
  )
}
