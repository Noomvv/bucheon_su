// app/hooks/useIdeaVoting.js
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'

export function useIdeaVoting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ideaId, voteValue }) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Требуется авторизация')

      const userId = session.user.id

      // Проверяем текущий голос
      const { data: existing } = await supabase
        .from('idea_votes')
        .select('vote')
        .eq('idea_id', ideaId)
        .eq('user_id', userId)
        .single()

      if (existing) {
        if (existing.vote === voteValue) {
          await supabase
            .from('idea_votes')
            .delete()
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
          return { ideaId, newVote: 0, previousVote: voteValue }
        } else {
          await supabase
            .from('idea_votes')
            .update({ vote: voteValue })
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
          return { ideaId, newVote: voteValue, previousVote: existing.vote }
        }
      } else {
        await supabase
          .from('idea_votes')
          .insert({ idea_id: ideaId, user_id: userId, vote: voteValue })
        return { ideaId, newVote: voteValue, previousVote: 0 }
      }
    },
    onMutate: async ({ ideaId, voteValue }) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: ['ideas'] })

      // Сохраняем предыдущее состояние
      const previousIdeas = queryClient.getQueryData(['ideas'])

      // МГНОВЕННОЕ обновление - синхронно
      queryClient.setQueryData(['ideas'], (oldIdeas) => {
        if (!oldIdeas) return oldIdeas
        
        return oldIdeas.map(idea => {
          if (idea.id !== ideaId) return idea

          let { likes, dislikes, myVote } = idea
          
          // Синхронное вычисление - сразу меняем UI
          if (myVote === voteValue) {
            if (voteValue === 1) likes--
            else dislikes--
            myVote = 0
          } else {
            if (myVote === 0) {
              voteValue === 1 ? likes++ : dislikes++
            } else {
              if (voteValue === 1) {
                likes++
                dislikes--
              } else {
                dislikes++
                likes--
              }
            }
            myVote = voteValue
          }
          
          return { ...idea, likes, dislikes, myVote }
        })
      })

      return { previousIdeas }
    },
    onError: (err, variables, context) => {
      // При ошибке возвращаем старые данные
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas)
      }
      
      if (err.message === 'Требуется авторизация') {
        alert('Чтобы голосовать, пожалуйста, войдите или зарегистрируйтесь.')
      }
    },
    onSettled: () => {
      // После завершения обновляем данные с сервера
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })
}