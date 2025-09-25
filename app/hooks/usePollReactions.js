// app/hooks/usePollReactions.js
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

async function fetchPollReactions(pollId) {
  const [votesResponse, sessionResponse] = await Promise.all([
    supabase.from('poll_reactions').select('vote, user_id').eq('poll_id', pollId),
    supabase.auth.getSession()
  ])

  const votes = votesResponse.data || []
  const session = sessionResponse.data?.session

  const counts = {
    yes: votes.filter(v => v.vote === 1).length,
    maybe: votes.filter(v => v.vote === 0).length,
    no: votes.filter(v => v.vote === -1).length,
  }

  let myVote = null
  if (session) {
    const myReaction = votes.find(v => v.user_id === session.user.id)
    myVote = myReaction?.vote ?? null
  }

  return { counts, myVote }
}

export function usePollReactions(pollId) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['pollReactions', pollId],
    queryFn: () => fetchPollReactions(pollId),
    staleTime: 2 * 60 * 1000, // 2 минуты кэша
  })

  const mutation = useMutation({
    mutationFn: async (newVote) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const userId = session.user.id
      const currentVote = data?.myVote
      const nextVote = currentVote === newVote ? null : newVote

      if (nextVote === null) {
        await supabase
          .from('poll_reactions')
          .delete()
          .eq('poll_id', pollId)
          .eq('user_id', userId)
      } else {
        await supabase
          .from('poll_reactions')
          .upsert(
            { poll_id: pollId, user_id: userId, vote: nextVote },
            { onConflict: ['poll_id', 'user_id'] }
          )
      }

      return nextVote
    },
    onMutate: async (newVote) => {
      // Оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ['pollReactions', pollId] })
      
      const previousData = queryClient.getQueryData(['pollReactions', pollId])
      const currentVote = previousData?.myVote
      const nextVote = currentVote === newVote ? null : newVote

      queryClient.setQueryData(['pollReactions', pollId], old => ({
        ...old,
        myVote: nextVote,
        counts: updateCounts(old?.counts, currentVote, nextVote)
      }))

      return { previousData }
    },
    onError: (err, newVote, context) => {
      queryClient.setQueryData(['pollReactions', pollId], context.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pollReactions', pollId] })
    }
  })

  return {
    counts: data?.counts || { yes: 0, maybe: 0, no: 0 },
    myVote: data?.myVote || null,
    isLoading,
    handleVote: mutation.mutate
  }
}

function updateCounts(counts, oldVote, newVote) {
  const newCounts = { ...counts }
  
  // Убираем старый голос
  if (oldVote === 1) newCounts.yes--
  else if (oldVote === 0) newCounts.maybe--
  else if (oldVote === -1) newCounts.no--
  
  // Добавляем новый голос
  if (newVote === 1) newCounts.yes++
  else if (newVote === 0) newCounts.maybe++
  else if (newVote === -1) newCounts.no++
  
  return newCounts
}