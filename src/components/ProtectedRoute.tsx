import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user

      if (!user) {
        router.push('/login')
      } else {
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) return <p>Loading...</p>
  if (!isAuthenticated) return null

  return <>{children}</>
}
