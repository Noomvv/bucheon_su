// app/components/PollList.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PollCard from './PollCard'
import styles from './PollList.module.css'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function PollList() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolls()
  }, [])

  async function fetchPolls() {
    setLoading(true)
    const { data, error } = await supabase
      .from('polls')
      .select('id, question, created_at')
      .order('created_at', { ascending: false })
    
    if (!error) setPolls(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ArrowPathIcon className={styles.loadingIcon} />
        <span>Загрузка опросов...</span>
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <div className={styles.emptyState}>
        Пока нет ни одного опроса
      </div>
    )
  }

  return (
    <div className={styles.listContainer}>
      {polls.map(p => (
        <PollCard key={p.id} poll={p} />
      ))}
    </div>
  )
}