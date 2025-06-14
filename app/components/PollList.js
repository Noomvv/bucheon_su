// app/components/PollList.js
'use client'

import { useState, useEffect } from 'react'
import { supabase }             from '../../lib/supabaseClient'
import PollCard                 from './PollCard'

export default function PollList() {
  const [polls, setPolls] = useState([])

  useEffect(() => {
    supabase
      .from('polls')
      .select('id, question, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPolls(data)
      })
  }, [])

  return (
    <div>
      {polls.map(p => (
        <PollCard key={p.id} poll={p} />
      ))}
    </div>
  )
}
