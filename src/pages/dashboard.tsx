import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { Spinner } from 'react-bootstrap'

export default function Dashboard() {
  const [userId, setUserId] = useState('')
  const [createdTasks, setCreatedTasks] = useState<any[]>([])
  const [assignedTasks, setAssignedTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      const authUser = session?.user
      if (!authUser) {
        router.push('/login')
        return
      }

      // Step 1: Get the matching user ID from the users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      if (userError || !userRecord) {
        setError('User not found in users table.')
        setLoading(false)
        return
      }

      const userId = userRecord.id
      setUserId(userId)

      // Step 2: Fetch created and assigned tasks
      const [createdRes, assignedRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('created_by', userId),
        supabase.from('tasks').select('*').eq('assigned_to', userId),
      ])

      if (createdRes.error || assignedRes.error) {
        setError(createdRes.error?.message || assignedRes.error?.message || 'Error fetching tasks')
      } else {
        setCreatedTasks(createdRes.data || [])
        setAssignedTasks(assignedRes.data || [])
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const getOverdue = (tasks: any[]) => {
    return tasks.filter(
      (task) => task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
    )
  }

  const countByStatus = (tasks: any[]) => {
    const statusCount: Record<string, number> = { todo: 0, in_progress: 0, completed: 0 }
    tasks.forEach((t) => {
      if (statusCount[t.status] !== undefined) {
        statusCount[t.status]++
      }
    })
    return statusCount
  }

  // Remove duplicate tasks based on task ID by creating a Set
  const getUniqueTasks = (tasks: any[]) => {
    const taskIds = new Set()
    return tasks.filter((task) => {
      if (taskIds.has(task.id)) {
        return false
      }
      taskIds.add(task.id)
      return true
    })
  }

  if (loading) return <div className="spinner-container"><Spinner animation="border" /></div>
  if (error) return <div className="error-message">{error}</div>

  // Filter tasks that belong to the logged-in user (either created or assigned to)
  const userTasks = [...createdTasks, ...assignedTasks]
  const uniqueUserTasks = getUniqueTasks(userTasks)

  const overdueTasks = getOverdue(uniqueUserTasks)
  const statusSummary = countByStatus(uniqueUserTasks)

  return (
    <div className="dashboard-container">
      <h1>📊 Dashboard</h1>

      <div className="task-summary">
        <div className="summary-card">
          <strong>Tasks Created by You</strong>
          <p>{createdTasks.length}</p>
        </div>
        <div className="summary-card">
          <strong>Tasks Assigned to You</strong>
          <p>{assignedTasks.length}</p>
        </div>
        <div className="summary-card overdue">
          <strong>Overdue Tasks</strong>
          <p>{overdueTasks.length}</p>
        </div>
      </div>

      <h2 className="status-summary-title">Task Status Summary</h2>
      <div className="status-summary">
        <div><strong>📝 To Do: </strong>{statusSummary.todo}</div>
        <div><strong>🚧 In Progress: </strong>{statusSummary.in_progress}</div>
        <div><strong>✅ Completed: </strong>{statusSummary.completed}</div>
      </div>
    </div>
  )
}
