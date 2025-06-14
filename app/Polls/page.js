// app/polls/page.js
'use client'

import AddPollButton from '../components/AddPollButton'
import PollList      from '../components/PollList'

export default function PollsPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Опросы</h1>
      <AddPollButton />
      <PollList />
    </div>
  )
}
