// app/Ideas/page.js
'use client'

import { useState } from 'react'
import IdeaForm     from '../components/IdeaForm'
import IdeaList     from '../components/IdeaList'
import Information from '../components/Information'

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
        <Information />
      {/* Форма для добавления новой идеи */}
      <IdeaForm onSuccess={() => setRefreshKey(k => k + 1)} />

      {/* Список идей с пагинацией и фильтрацией */}
      <IdeaList key={refreshKey} />
    </div>
  )
}
