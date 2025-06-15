'use client'

import Link from 'next/link'
import PollReactions from './PollReactions'

export default function PollCard({ poll }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 4,
      padding: 12,
      marginBottom: 12
    }}>
      <h3>{poll.question}</h3>

      {/* Вставляем готовый компонент с реакциями */}
      <PollReactions pollId={poll.id} />

      {/* Ссылка на страницу комментариев */}
      <Link href={`/Polls/${poll.id}`}>
        <button style={{ marginTop: 8 }}>
          Комментарии »
        </button>
      </Link>
    </div>
  )
}
