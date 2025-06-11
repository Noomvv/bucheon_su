'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// ≥8 chars, letters+digits
const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export default function RegistrationForm({ onBack }) {
  const [stage, setStage]             = useState(1)
  const [studentId, setStudentId]     = useState('')
  const [studentData, setStudentData] = useState(null)
  const [login, setLogin]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirm]     = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  // Шаг 1: проверка ID
  async function lookup() {
    setError(''); setLoading(true)
    const idNum = parseInt(studentId.trim(),10)
    const { data, error } = await supabase
      .from('students')
      .select('firstname,lastname,faculty,auth_user_id')
      .eq('student_id', idNum)
      .single()
    setLoading(false)
    if (error || !data)         return setError('ID не найден')
    if (data.auth_user_id)      return setError('ID уже зарегистрирован')
    setStudentData(data)
    setStage(2)
  }

  // Шаг 2: регистрация
  async function register() {
    setError('')
    if (!PASS_RE.test(password))       return setError('Пароль ≥8, буквы+цифры')
    if (password !== confirmPass)      return setError('Пароли не совпадают')

    setLoading(true)
    const res = await fetch('/api/register', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        studentId: parseInt(studentId.trim(),10),
        login, password
      })
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) return setError(json.error)
    // всё успешно — PersonalPage перезагрузится и покажет приветствие
  }

  // UI
  if (stage===1) {
    return (
      <form onSubmit={e=>{e.preventDefault();lookup()}} style={{display:'grid',gap:12}}>
        {error && <p style={{color:'red'}}>{error}</p>}
        <label>
          Student ID:<br/>
          <input
            type="text"
            value={studentId}
            onChange={e=>setStudentId(e.target.value)}
            required style={{width:'100%',padding:8}}
          />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button type="submit" disabled={loading} style={{flex:1}}>
            {loading?'…':'Проверить ID'}
          </button>
          <button type="button" onClick={onBack} style={{flex:1}}>
            Назад
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={e=>{e.preventDefault();register()}} style={{display:'grid',gap:12}}>
      {error && <p style={{color:'red'}}>{error}</p>}
      <div>
        <strong>{studentData.firstname} {studentData.lastname}</strong>
        <p>Факультет: {studentData.faculty}</p>
      </div>

      <label>
        Логин:<br/>
        <input
          type="text" value={login}
          onChange={e=>setLogin(e.target.value)}
          required style={{width:'100%',padding:8}}
        />
      </label>

      <label>
        Пароль:<br/>
        <input
          type="password" value={password}
          onChange={e=>setPassword(e.target.value)}
          required style={{width:'100%',padding:8}}
        />
      </label>

      <label>
        Подтвердите:<br/>
        <input
          type="password" value={confirmPass}
          onChange={e=>setConfirm(e.target.value)}
          required style={{width:'100%',padding:8}}
        />
      </label>

      <div style={{display:'flex',gap:8}}>
        <button type="submit" disabled={loading} style={{flex:1}}>
          {loading?'…':'Зарегистрироваться'}
        </button>
        <button type="button" onClick={()=>setStage(1)} style={{flex:1}}>
          Назад
        </button>
      </div>
    </form>
  )
}
