import { useState, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
  
    setError('')
    setLoading(true)
  
    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
        } else {
          // ✅ Insert into 'users' table after successful signup
          const user = data.user
          if (user) {
            const { error: insertError } = await supabase.from('users').insert([
              {
                id: user.id,
                email: user.email
              }
            ])
            if (insertError) {
              console.error('Insert user error:', insertError.message)
              setError('Account created, but failed to save user data.')
            } else {
              alert('Check your email for confirmation link!')
            }
          }
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }  

  return (
    <div style={styles.container}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p style={styles.switch}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#007bff',
    border: 'none',
    color: 'white',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonDisabled: {
    backgroundColor: '#bbb',
    cursor: 'not-allowed',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  switch: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  switchButton: {
    textDecoration: 'underline',
    border: 'none',
    background: 'none',
    color: 'blue',
    cursor: 'pointer',
  },
}
