// app/components/IdeaList.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import IdeaVoting from './IdeaVoting'
import styles from './IdeaList.module.css'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

export default function IdeaList() {
  const [ideas, setIdeas] = useState([])
  const [page, setPage] = useState(1)
  const [dbCategories, setDbCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const PAGE_SIZE = 10

  // Загрузка категорий
  useEffect(() => {
    supabase
      .from('ideas')
      .select('category', { distinct: true })
      .then(({ data }) => {
        const cats = Array.isArray(data)
          ? data.map(r => r.category).filter(Boolean)
          : []
        setDbCategories(cats)
      })
  }, [])

  const categories = Array.from(
    new Set([...STATIC_CATEGORIES, ...dbCategories])
  )

  // Загрузка идей
  const fetchIdeas = async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('ideas')
      .select(
        `id, content, category, created_at,
         students!inner(firstname,lastname,faculty)`
      , { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (categoryFilter && categoryFilter !== 'asc' && categoryFilter !== 'desc') {
      query = query.eq('category', categoryFilter)
    }
    if (searchTerm.trim()) query = query.ilike('content', `%${searchTerm.trim()}%`)

    const { data, error } = await query
    setLoading(false)
    if (error) {
      console.error('Error fetching ideas', error)
      return
    }

    setIdeas(data || [])
  }

  useEffect(() => {
    fetchIdeas()
  }, [page, categoryFilter, searchTerm])

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Поиск по тексту..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
          className={styles.searchInput}
        />
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
          className={styles.select}
        >
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="asc">По возрастанию лайков</option>
          <option value="desc">По убыванию лайков</option>
        </select>
      </div>

      {loading && (
        <div className={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonMeta}></div>
              <div className={styles.skeletonButtons}></div>
            </div>
          ))}
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <div className={styles.emptyState}>
          {searchTerm || categoryFilter 
            ? "Идей по вашему запросу не найдено" 
            : "Пока нет ни одной идеи. Будьте первым!"}
        </div>
      )}

      {!loading && ideas.map(idea => (
        <div key={idea.id} className={styles.card}>
          <p className={styles.content}>{idea.content}</p>
          <p className={styles.metaText}>
            Категория: {idea.category || 'Без категории'}<br />
            Автор: {idea.students.firstname} {idea.students.lastname}, {idea.students.faculty}
          </p>
          <IdeaVoting 
            ideaId={idea.id}
            initialLikes={0}
            initialDislikes={0}
            initialMyVote={0}
          />
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
        >
          ← Назад
        </button>
        <button
          className={styles.paginationButton}
          disabled={ideas.length < PAGE_SIZE}
          onClick={() => setPage(p => p + 1)}
        >
          Вперед →
        </button>
      </div>
    </div>
  )
}