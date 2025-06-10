'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const FACULTIES = [
  { value: 'management',  label: 'Менеджмент' },
  { value: 'linguistics', label: 'Корейский язык' },
  { value: 'it',          label: 'Информатика' },
  { value: 'economics',   label: 'Экономика' },
]

export default function RegistrationForm({ onSuccess }) {
  const [studentId, setStudentId] = useState('')
  const [faculty, setFaculty]     = useState(FACULTIES[0].value)
  const [error, setError]         = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    const idNum = parseInt(studentId.trim(), 10)

    // 1. Проверка в students
    const { data: student, error: err1 } = await supabase
      .from('students')
      .select('student_id')
      .eq('student_id', idNum)
      .single()

    if (err1 || !student) {
      setError('Такого Student ID нет в базе.')
      return
    }

    // 2. Достать user
    const { data: { user }, error: errU } = await supabase.auth.getUser()
    if (errU) {
      setError('Ошибка при получении пользователя.')
      return
    }

    // 3. Вставить в profiles
    const { error: err2 } = await supabase
      .from('profiles')
      .insert({
        id:           user.id,
        student_id:   idNum,
        faculty,
        email:        user.email,
        first_name:   user.user_metadata?.given_name || '',
        last_name:    user.user_metadata?.family_name  || ''
      })
    if (err2) {
      console.error('insert profile error:', err2)
      setError('Не удалось сохранить профиль.')
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Student ID:</label><br/>
        <input
          type="number"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          required style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div>
        <label>Факультет:</label><br/>
        <select
          value={faculty}
          onChange={e => setFaculty(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        >
          {FACULTIES.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      <button type="submit" style={{
        padding: '10px 20px', background: '#28A745', color: '#FFF',
        border: 'none', borderRadius: 4, cursor: 'pointer'
      }}>
        Зарегистрироваться
      </button>
    </form>
  )
}
