'use client'

import { useState } from 'react'
import PollList from '../components/PollList'
import PollCreationForm from '../components/PollCreationForm'
import styles from './page.module.css'

// TODO: move this secret into an env var in real deployments
const ADMIN_SECRET = 'Софочка'

export default function PollsPage() {
  const [pollVersion, setPollVersion] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleAdminAccess = () => {
    const answer = prompt('Введите секретное слово для создания опроса:')
    if (answer === ADMIN_SECRET) {
      setIsAdmin(true)
    } else {
      alert('Неверное секретное слово.')
    }
  }

  const handleCreated = () => {
    setPollVersion(v => v + 1)
    setIsAdmin(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PollList key={pollVersion} />
        {!isAdmin ? (
          <button onClick={handleAdminAccess} className={styles.button}>
            Добавить опрос
          </button>
        ) : (
          <PollCreationForm onCreated={handleCreated} />
        )}
      </div>
    </div>
  )
}