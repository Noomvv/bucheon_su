'use client'
import { supabase } from '../../lib/supabaseClient'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }
  return (
    <button
      onClick={handleLogout}
      style={{
        padding:'8px 16px',
        background:'#e53e3e',
        color:'#fff',
        border:'none',
        borderRadius:4,
        cursor:'pointer',
        marginTop:16
      }}
    >
      Выйти
    </button>
  )
}
