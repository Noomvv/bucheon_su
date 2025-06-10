'use client'
import { supabase } from '../../lib/supabaseClient'

export default function AuthButton() {
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/personal` }
    })
  }
  return (
    <button onClick={handleGoogleSignIn} style={{
      padding: '10px 20px', background: '#3366FF', color: '#FFF',
      border: 'none', borderRadius: 4, cursor: 'pointer'
    }}>
      Войти через Google
    </button>
  )
}
