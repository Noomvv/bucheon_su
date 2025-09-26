// app/providers.js
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Создаем клиент вне компонента для экспорта
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут кэша
      refetchOnWindowFocus: false, // Не обновлять при фокусе
    },
  },
})

// Экспортируем queryClient для использования в других файлах
export let queryClient

export function Providers({ children }) {
  const [client] = useState(() => {
    queryClient = createQueryClient()
    return queryClient
  })

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}