// app/hooks/usePersonalData.js
'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient' // Убедитесь что импорт есть
import { queryClient } from '../providers' // Добавьте этот импорт

const LIKE_THRESHOLD = 100

async function fetchSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

async function fetchStudentData(session) {
  if (!session) return null

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  return student
}

async function fetchStats(studentId) {
  if (!studentId) return { ideasCount: 0, totalLikes: 0, volunteerHours: 0 }

  const [{ data: ideas }, { data: volunteer }] = await Promise.all([
    supabase
      .from('ideas')
      .select('student_id, content, idea_votes(vote)'),
    supabase
      .from('volunteers')
      .select('total_hours')
      .eq('student_id', studentId)
      .single()
  ])

  let ideasCount = 0
  let totalLikes = 0

  if (ideas) {
    const likesMap = {}
    ideas.forEach(i => {
      const likesCount = i.idea_votes.filter(v => v.vote === 1).length
      likesMap[i.student_id] = (likesMap[i.student_id] || 0) + likesCount
    })

    ideasCount = ideas.filter(i => i.student_id === studentId).length
    totalLikes = likesMap[studentId] || 0
  }

  const volunteerHours = volunteer?.total_hours || 0

  return { ideasCount, totalLikes, volunteerHours }
}

async function fetchNotifications(studentId) {
  if (!studentId) return []

  const { data: ideas } = await supabase
    .from('ideas')
    .select('content, idea_votes(vote)')
    .eq('student_id', studentId)

  if (!ideas) return []

  const notifications = ideas
    .filter(i => i.idea_votes.filter(v => v.vote === 1).length >= LIKE_THRESHOLD)
    .map(i => `Ваша идея «${i.content}» набрала ${LIKE_THRESHOLD}+ лайков и отправлена на рассмотрение.`)

  return notifications
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useStudentData(session) {
  return useQuery({
    queryKey: ['student', session?.user?.id],
    queryFn: () => fetchStudentData(session),
    enabled: !!session,
    staleTime: 10 * 60 * 1000,
  })
}

export function useStats(studentId) {
  return useQuery({
    queryKey: ['stats', studentId],
    queryFn: () => fetchStats(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useNotifications(studentId) {
  return useQuery({
    queryKey: ['notifications', studentId],
    queryFn: () => fetchNotifications(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  })
}