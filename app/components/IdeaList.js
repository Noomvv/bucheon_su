'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import styles                  from './IdeaList.module.css'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

export default function IdeaList() {
  const [ideas, setIdeas]               = useState([])
  const [page, setPage]                 = useState(1)
  const [dbCategories, setDbCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm]     = useState('')
  const [loading, setLoading]           = useState(false)
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
    const to   = from + PAGE_SIZE - 1

    let query = supabase
      .from('ideas')
      .select(
        `id, content, category, created_at,
         students!inner(firstname,lastname,faculty),
         idea_votes(vote, user_id)`
      , { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (categoryFilter) query = query.eq('category', categoryFilter)
    if (searchTerm.trim()) query = query.ilike('content', `%${searchTerm.trim()}%`)

    const { data, error } = await query
    setLoading(false)
    if (error) {
      console.error('Error fetching ideas', error)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user.id

    const enriched = data.map(idea => {
      const likes    = idea.idea_votes.filter(v => v.vote === 1).length
      const dislikes = idea.idea_votes.filter(v => v.vote === -1).length
      const myVote   = idea.idea_votes.find(v => v.user_id === userId)?.vote || 0
      return { ...idea, likes, dislikes, myVote }
    })

    setIdeas(enriched)
  }

  useEffect(() => {
    fetchIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, searchTerm])

  // Оптимистичное голосование
  const handleVote = async (ideaId, voteValue) => {
    // Обновляем локально
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id !== ideaId) return idea
        let { likes, dislikes, myVote } = idea
        if (myVote === voteValue) {
          // убираем голос
          if (voteValue === 1) likes--
          else dislikes--
          myVote = 0
        } else {
          // ставим/меняем голос
          if (myVote === 0) {
            voteValue === 1 ? likes++ : dislikes++
          } else {
            if (voteValue === 1) { likes++; dislikes-- }
            else               { dislikes++; likes-- }
          }
          myVote = voteValue
        }
        return { ...idea, likes, dislikes, myVote }
      })
    )

    // Сохраняем на бэкенде
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Чтобы голосовать, пожалуйста, войдите или зарегистрируйтесь.')
      return
    }
    const userId = session.user.id

    const { data: existing, error: fetchErr } = await supabase
      .from('idea_votes')
      .select('vote')
      .eq('idea_id', ideaId)
      .eq('user_id', userId)
      .single()

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error('Error checking existing vote', fetchErr)
      return
    }

    if (existing) {
      if (existing.vote === voteValue) {
        await supabase
          .from('idea_votes')
          .delete()
          .eq('idea_id', ideaId)
          .eq('user_id', userId)
      } else {
        await supabase
          .from('idea_votes')
          .update({ vote: voteValue })
          .eq('idea_id', ideaId)
          .eq('user_id', userId)
      }
    } else {
      await supabase
        .from('idea_votes')
        .insert({ idea_id: ideaId, user_id: userId, vote: voteValue })
    }
  }

  // Иконки
  const ThumbUpIcon = () => (
    <svg className={`${styles.icon} ${styles.thumbUp}`} viewBox="0 0 24 24">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
    </svg>
  )

  const ThumbDownIcon = () => (
    <svg className={`${styles.icon} ${styles.thumbDown}`} viewBox="0 0 24 24">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
    </svg>
  )

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
        </select>
      </div>

      {loading && <p className={styles.loading}>Загрузка идей...</p>}

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
            <strong>Категория:</strong> {idea.category || 'Без категории'}<br />
            <strong>Автор:</strong> {idea.students.firstname} {idea.students.lastname}, {idea.students.faculty}
          </p>
          <div className={styles.voteButtons}>
            <button
              className={
                `${styles.voteButton} ${styles.likeButton} ${idea.myVote === 1 ? styles.active : ''}`
              }
              onClick={() => handleVote(idea.id, 1)}
              aria-label="Поддержать идею"
            >
              <ThumbUpIcon />
              <span className={styles.voteCount}>{idea.likes}</span>
            </button>
            <button
              className={
                `${styles.voteButton} ${styles.dislikeButton} ${idea.myVote === -1 ? styles.active : ''}`
              }
              onClick={() => handleVote(idea.id, -1)}
              aria-label="Не поддерживаю идею"
            >
              <ThumbDownIcon />
              <span className={styles.voteCount}>{idea.dislikes}</span>
            </button>
          </div>
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
