// app/hooks/usePolls.js
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient' // Исправленный путь

async function fetchPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('id, question, created_at')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

export function usePolls() {
  return useQuery({
    queryKey: ['polls'],
    queryFn: fetchPolls,
    staleTime: 5 * 60 * 1000,
  })
}