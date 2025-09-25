// app/hooks/useIdeas.js
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'

const STATIC_CATEGORIES = [
  'Образование',
  'Инфраструктура',
  'События',
  'Соц. проекты',
  'Экология',
  'Другое'
]

async function fetchIdeas({ categoryFilter = '', searchTerm = '', page = 1 }) {
  const PAGE_SIZE = 10
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('ideas')
    .select(
      `id, content, category, created_at,
       students!inner(firstname,lastname,faculty)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (categoryFilter && !['asc', 'desc'].includes(categoryFilter)) {
    query = query.eq('category', categoryFilter)
  }
  
  if (searchTerm.trim()) {
    query = query.ilike('content', `%${searchTerm.trim()}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data || []
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from('ideas')
    .select('category', { distinct: true })

  if (error) throw new Error(error.message)

  const dbCategories = Array.isArray(data) 
    ? data.map(r => r.category).filter(Boolean)
    : []

  return Array.from(new Set([...STATIC_CATEGORIES, ...dbCategories])).sort()
}

export function useIdeas({ categoryFilter = '', searchTerm = '', page = 1 } = {}) {
  return useQuery({
    queryKey: ['ideas', { categoryFilter, searchTerm, page }],
    queryFn: () => fetchIdeas({ categoryFilter, searchTerm, page }),
    staleTime: 5 * 60 * 1000, // 5 минут кэша
    keepPreviousData: true,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['ideaCategories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 минут кэша для категорий
  })
}