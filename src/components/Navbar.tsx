import { CSSProperties, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import LogoutButton from './LogoutButton'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const getUserName = (email: string) => {
    const username = email.split('@')[0]
    return username.charAt(0).toUpperCase() + username.slice(1) // Capitalize the first letter
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link href="/dashboard" style={styles.link}>Dashboard</Link>
        <Link href="/tasks" style={styles.link}>Tasks</Link>
      </div>

      {user ? (
        <div style={styles.userSection}>
          <span style={styles.welcomeText}>Welcome, {getUserName(user.email)}</span>
          <LogoutButton />
        </div>
      ) : (
        <Link href="/login" style={styles.link}>Login</Link>
      )}
    </nav>
  )
}

const styles: { [key: string]: CSSProperties } = {
  navbar: {
    padding: '1rem 2rem',
    backgroundColor: '#007bff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
  linkHover: {
    color: '#ffcc00', // Yellow hover effect for links
  },
  userSection: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  logoutButton: {
    color: 'white',
    backgroundColor: '#e74c3c', // Red background for logout
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  logoutHover: {
    backgroundColor: '#c0392b', // Darker red for hover
  },
}

