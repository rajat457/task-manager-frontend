import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        router.push('/login')
        return
      }

      const authUser = session.user

      // Step 1: Get the corresponding user ID from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      if (userError || !userData) {
        setError('Unable to find matching user in database.')
        setLoading(false)
        return
      }

      const userId = userData.id

      // Step 2: Fetch tasks using the real users.id
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
        .order('due_date', { ascending: true })

      if (tasksError) {
        setError(tasksError.message)
      } else {
        setTasks(tasksData || [])
      }

      setLoading(false)
    }

    fetchTasks()
  }, [router])

  const isOverdue = (dueDate: string) => {
    return dueDate && new Date(dueDate) < new Date()
  }

  if (loading) return <p style={styles.loading}>Loading tasks...</p>
  if (error) return <p style={styles.error}>{error}</p>

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Tasks</h1>
      <Link href="/tasks/create">
        <button style={styles.createButton}>Create New Task</button>
      </Link>

      {tasks.length === 0 && <p style={styles.noTasks}>No tasks found.</p>}

      <ul style={styles.taskList}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.taskItem}>
            <Link href={`/tasks/${task.id}`} style={styles.taskLink}>
              <strong>{task.title}</strong>
            </Link>
            <div style={styles.taskStatus}>Status: {task.status}</div>
            <div style={styles.taskDueDate}>
              Due: {task.due_date ? task.due_date.slice(0, 10) : 'No due date'}
            </div>
            {isOverdue(task.due_date) && task.status !== 'completed' && (
              <span style={styles.overdue}>⚠️ Overdue</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  createButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  taskList: {
    listStyle: 'none',
    padding: '0',
  },
  taskItem: {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderBottom: '1px solid #ccc',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  taskLink: {
    textDecoration: 'none',
    color: 'blue',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  taskDueDate: {
    fontSize: '1rem',
    marginTop: '0.5rem',
    color: '#555',
  },
  overdue: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  noTasks: {
    fontSize: '1.2rem',
    color: '#777',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: 'blue',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: 'red',
  },
}
