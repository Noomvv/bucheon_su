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
          // Удаляем голос если кликаем на ту же кнопку
          await supabase
            .from('idea_votes')
            .delete()
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
          return { ideaId, newVote: 0, previousVote: voteValue }
        } else {
          // Изменяем голос
          await supabase
            .from('idea_votes')
            .update({ vote: voteValue })
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
          return { ideaId, newVote: voteValue, previousVote: existing.vote }
        }
      } else {
        // Добавляем новый голос
        await supabase
          .from('idea_votes')
          .insert({ idea_id: ideaId, user_id: userId, vote: voteValue })
        return { ideaId, newVote: voteValue, previousVote: 0 }
      }
    },
    onMutate: async ({ ideaId, voteValue }) => {
      // Отменяем текущие запросы чтобы не перезаписать оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ['ideas'] })

      // Сохраняем предыдущее состояние для отката
      const previousIdeas = queryClient.getQueryData(['ideas'])

      // Оптимистичное обновление
      queryClient.setQueryData(['ideas'], (old) => {
        if (!old) return old
        
        return old.map(idea => {
          if (idea.id !== ideaId) return idea

          let { likes, dislikes, myVote } = idea
          
          if (myVote === voteValue) {
            // Убираем голос
            if (voteValue === 1) likes--
            else dislikes--
            myVote = 0
          } else {
            // Добавляем/изменяем голос
            if (myVote === 0) {
              // Новый голос
              voteValue === 1 ? likes++ : dislikes++
            } else {
              // Изменение голоса
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
      // Откатываем изменения при ошибке
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas)
      }
    },
    onSettled: () => {
      // Инвалидируем кэш чтобы убедиться в актуальности данных
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })
}