// app/components/AddPollButton.js
'use client'

import { useState } from 'react'
import PollFormModal  from './PollFormModal'

export default function AddPollButton() {
  const [open, setOpen] = useState(false)

  const tryOpen = () => {
    const secret = prompt('Введите секретное слово:')
    if (secret === 'Софочка') setOpen(true)
    else if (secret != null) alert('Неверное слово')
  }

  return (
    <>
      <button onClick={tryOpen} style={{ marginBottom: 20 }}>
        + Добавить опрос
      </button>
      {open && <PollFormModal onClose={() => setOpen(false)} />}
    </>
  )
}
