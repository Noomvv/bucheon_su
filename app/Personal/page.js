'use client'
import { useState, useEffect } from 'react'
import { supabase }        from '../../lib/supabaseClient'
import AuthButton          from '../components/AuthButton'
import RegistrationForm    from '../components/RegistrationForm'
import ProfileCard         from '../components/ProfileCard'

export default function PersonalPage() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) await fetchProfile(data.session.user.id)
      setLoading(false)
    }
    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        if (newSession) await fetchProfile(newSession.user.id)
        else setProfile(null)
      }
    )
    return () => listener?.subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) console.error('fetchProfile error:', error)
    else setProfile(data)
    setLoading(false)
  }

  if (loading) return <p>Загрузка…</p>
  if (!session) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>Войдите через Google</h1>
        <AuthButton />
      </div>
    )
  }
  if (!profile) {
    return (
      <div style={{ maxWidth: 400, margin: '50px auto' }}>
        <h2>Регистрация студента</h2>
        <RegistrationForm onSuccess={() => fetchProfile(session.user.id)} />
      </div>
    )
  }
  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <ProfileCard
        firstName={profile.first_name}
        lastName={profile.last_name}
      />
    </div>
  )
}
