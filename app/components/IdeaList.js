// app/components/IdeaList.js
'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

export default function IdeaList() {
  const [ideas, setIdeas]         = useState([])
  const [page, setPage]           = useState(1)
  const [dbCategories, setDbCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading]     = useState(false)
  const PAGE_SIZE = 10

  // Загружаем категории
  useEffect(() => {
    supabase
      .from('ideas')
      .select('category', { distinct: true })
      .then(({ data }) => {
        const cats = data.map(r => r.category).filter(Boolean)
        setDbCategories(cats)
      })
  }, [])

  // Объединяем категории
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
      .select(`
        id,
        content,
        category,
        created_at,
        students!inner(firstname,lastname,faculty),
        idea_votes(vote, user_id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (categoryFilter) {
      query = query.eq('category', categoryFilter)
    }
    if (searchTerm.trim()) {
      query = query.ilike('content', `%${searchTerm.trim()}%`)
    }

    const { data, error } = await query
    setLoading(false)
    if (error) {
      console.error(error)
      return
    }

    const {
      data: { session }
    } = await supabase.auth.getSession()
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

  const handleVote = async (ideaId, voteValue) => {
    const {
      data: { session }
    } = await supabase.auth.getSession()
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
      console.error(fetchErr)
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

    fetchIdeas()
  }

  return (
    <div>
      {/* Фильтр и поиск */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Поиск по тексту…"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">— Все категории —</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p>Загрузка…</p>}

      {!loading && ideas.map(idea => (
        <div key={idea.id} style={{
          border: '1px solid #ddd',
          padding: 16,
          marginBottom: 16,
          borderRadius: 4
        }}>
          <p style={{ marginBottom: 8 }}>{idea.content}</p>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            <strong>Категория:</strong> {idea.category}<br/>
            <strong>Автор:</strong> {idea.students.firstname} {idea.students.lastname}, {idea.students.faculty}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button onClick={() => handleVote(idea.id, 1)}>
              👍 {idea.likes} {idea.myVote === 1 ? '(Ваш)' : ''}
            </button>
            <button onClick={() => handleVote(idea.id, -1)}>
              👎 {idea.dislikes} {idea.myVote === -1 ? '(Ваш)' : ''}
            </button>
          </div>
        </div>
      ))}

      {/* Пагинация */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 24
      }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
        >
          ← Назад
        </button>
        <button
          disabled={ideas.length < PAGE_SIZE}
          onClick={() => setPage(p => p + 1)}
        >
          Вперед →
        </button>
      </div>
    </div>
  )
}
