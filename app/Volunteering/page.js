// app/Volunteering/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './page.module.css'

export default function VolunteeringPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [volunteers, setVolunteers] = useState([])
  const [topLoading, setTopLoading] = useState(true)
  const [totalVolunteers, setTotalVolunteers] = useState(0)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadVolunteersData()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const loadVolunteersData = async () => {
    try {
      setTopLoading(true)
      
      const response = await fetch('/api/volunteers/top')
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
        setTotalVolunteers(data.length)
      }
    } catch (error) {
      console.error('Load volunteers error:', error)
    } finally {
      setTopLoading(false)
    }
  }

  const handleBecomeVolunteer = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Чтобы стать волонтером, пожалуйста, войдите или зарегистрируйтесь.')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/volunteers/become-volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.message === 'Вы уже являетесь волонтером') {
          alert('Вы уже являетесь волонтером!')
        } else {
          alert('Вы успешно стали волонтером!')
        }
        loadVolunteersData()
      } else {
        alert(result.error || 'Ошибка при регистрации')
      }
    } catch (error) {
      console.error('Request error:', error)
      alert('Ошибка сети. Проверьте подключение.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return (
    <div className={styles.container}>
      {/* Таблица волонтеров наверху */}
      <div className={styles.topContainer}>
        
        {/* Статистика */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalVolunteers}</div>
            <div className={styles.statLabel}>Всего участников</div>
          </div>
        </div>

        {/* Промо блок и кнопка */}
        <div className={styles.promoWrapper}>
        <img
          src="/images/promo3.png"
          alt="Волонтерство"
          className={styles.promoImageOverlap}
        />
        <div className={styles.promoBlock}>
          <div className={styles.promoText}>
            Здесь показаны самые активные волонтёры — чем больше часов, тем выше место.
          </div>
        </div>
        </div>

        <button 
        className={styles.button}
        onClick={handleBecomeVolunteer}
        disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Хочу участвовать'}
        </button>

        {topLoading ? (
          <div className={styles.loading}>Загрузка рейтинга волонтеров...</div>
        ) : volunteers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Пока нет волонтеров. Будьте первым!</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.topTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Имя и фамилия</th>
                  <th>Факультет</th>
                  <th>Часы</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer, index) => (
                  <tr key={volunteer.id}>
                    <td className={styles.rank}>{index + 1}</td>
                    <td>
                      <div className={styles.name}>
                        {volunteer.firstname} {volunteer.lastname}
                      </div>
                    </td>
                    <td className={styles.faculty}>{volunteer.faculty}</td>
                    <td>
                      <span className={styles.hours}>{volunteer.total_hours}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      

      
    </div>
  )
}