// app/components/AddPollButton.js
'use client'

import { useState } from 'react'
import PollFormModal from './PollFormModal'
import styles from './AddPollButton.module.css'

export default function AddPollButton() {
  const [open, setOpen] = useState(false)

  const tryOpen = () => {
    const secret = prompt('Только для админов.')
    if (secret === 'Софочка') setOpen(true)
    else if (secret != null) alert('Неверное слово')
  }

  return (
    <>
      <button 
        onClick={tryOpen} 
        className={styles.addButton}
      >
        Добавить опрос
      </button>
      {open && <PollFormModal onClose={() => setOpen(false)} />}
    </>
  )
}