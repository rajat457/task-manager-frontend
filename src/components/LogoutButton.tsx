import { CSSProperties, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        ...styles.logoutButton,
        ...(loading ? styles.disabled : {}),
      }}
      aria-label="Logout"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
const styles: { [key: string]: CSSProperties } = {
  logoutButton: {
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  disabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
}
