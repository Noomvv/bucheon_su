'use client'

import { useState }         from 'react'
import PollList             from '../components/PollList'
import PollCreationForm     from '../components/PollCreationForm'

// TODO: move this secret into an env var in real deployments
const ADMIN_SECRET = 'Софочка'

export default function PollsPage() {
  const [pollVersion, setPollVersion] = useState(0)
  const [isAdmin, setIsAdmin]         = useState(false)

  const handleAdminAccess = () => {
    const answer = prompt('Введите секретное слово для создания опроса:')
    if (answer === ADMIN_SECRET) {
      setIsAdmin(true)
    } else {
      alert('Неверное секретное слово.')
    }
  }

  const handleCreated = () => {
    // bump to refresh list, hide form again
    setPollVersion(v => v + 1)
    setIsAdmin(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      {/* remount to refetch when pollVersion changes */}
        <PollList key={pollVersion} />
        {!isAdmin ? (
        <button onClick={handleAdminAccess} style={{ marginBottom: 16 }}>
          Добавить опрос
        </button>
      ) : (
        <PollCreationForm onCreated={handleCreated} />
      )}

    </div>
  )
}
