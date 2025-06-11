'use client'
import { supabase } from '../../lib/supabaseClient'
import styles from './LogoutButton.module.css'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }
  
  return (
    <button
      onClick={handleLogout}
      className={styles.logoutBtn}
      aria-label="Выйти из аккаунта"
    >
      <svg 
        className={styles.icon} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
              stroke="currentColor" />
        <path d="M16 17L21 12L16 7" 
              stroke="currentColor" />
        <path d="M21 12H9" 
              stroke="currentColor" />
      </svg>
      <span>Выйти</span>
    </button>
  )
}