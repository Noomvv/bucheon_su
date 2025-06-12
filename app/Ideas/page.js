// app/Ideas/page.js
'use client'

import { useState } from 'react'
import IdeaForm     from '../components/IdeaForm'
import IdeaList     from '../components/IdeaList'

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Предложения по улучшению</h1>

      {/* Форма для добавления новой идеи */}
      <IdeaForm onSuccess={() => setRefreshKey(k => k + 1)} />

      {/* Список идей с пагинацией и фильтрацией */}
      <IdeaList key={refreshKey} />
    </div>
  )
}
